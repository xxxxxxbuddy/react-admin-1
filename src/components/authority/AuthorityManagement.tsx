import React from "react";
import {
  Row, Col, Input, Card, Button, Table, Form, InputNumber, Popconfirm,
  message, Icon, Select
} from "antd";
import BreadcrumbCustom from "../BreadcrumbCustom";
import { TableRowSelection } from "antd/lib/table";
import { getAuthorityInfo, updateAuthorityInfo } from "../../axios";
import Highlighter from "react-highlight-words";
const { Option } = Select;

const FormItem = Form.Item;
const EditableContext = React.createContext({});

type EditableRowProps = {
  form: any;
  index: any;
};
const EditableRow = ({ form, index, ...props }: EditableRowProps) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
type EditableCellProps = {
  inputType: string;
  editing: boolean;
  dataIndex: number;
  title: string;
  record: any;
  index: number;
};

class EditableCell extends React.Component<EditableCellProps> {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };
  render() {
    const { editing, dataIndex, title, inputType, record, index, ...restProps } = this.props;
    return (
      <EditableContext.Consumer>
        {(form: any) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `Please Input ${title}!`,
                      },
                    ],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : (
                  restProps.children
                )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class AuthorityManagement extends React.Component {
  constructor(props: any) {
    super(props);
    this.columns = [
      {
        title: '权限ID',
        dataIndex: 'authority_id',
        ...this.getColumnSearchProps('authority_id'),
      },
      {
        title: '租户ID',
        dataIndex: 'tenant_id',
        ...this.getColumnSearchProps('tenant_id'),
      },
      {
        title: '权限名',
        dataIndex: 'authority_name',
        ...this.getColumnSearchProps('authority_name'),
      },
      {
        title: '权限状态',
        dataIndex: 'authority_state',
        editable: true,
        ...this.getColumnSearchProps('authority_state'),
      },
      {
        title: '操作',
        width: 200,
        dataIndex: '操作',
        render: (text: any, record: any) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {(form: any) => (
                      <Button
                        onClick={() => this.save(form, record._id)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </Button>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    cancelText="取消"
                    okText="确认"
                    title="确认取消吗？"
                    onConfirm={() => this.cancel()}
                  >
                    <Button>取消</Button>
                  </Popconfirm>
                </span>
              ) : (
                  <Button onClick={() => this.edit(record._id)}>编辑</Button>
                )}
            </div>
          );
        },
      },
    ];
  }

  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    data: [],
    keys: new Map(),
    parkinglot: [],
    editingKey: '',
    searchText: '',
    searchedColumn: '',
    selectedAuthority: '',
    tenantId: '',
  };
  componentDidMount() {
    this.start();
  };

  searchInput: Input | null = null;
  columns: any[];

  start = async () => {
    this.setState({ loading: true });
    await getAuthorityInfo().then(({ code, data }: { code: number, data: any[] }) => {
      const map = new Map();
      data.forEach(n => map.set(n.authority_name, n.authority_id));
      this.setState({
        data,
        keys: map,
        loading: false,
      });
    }).catch(e => {
      this.setState({ loading: false });
    });
  };

  onSelectChange = (selectedRowKeys: string[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  isEditing = (record: any) => {
    return record._id === this.state.editingKey;
  };
  edit(key: string) {
    this.setState({ editingKey: key });
  }
  save(form: any, id: string) {
    form.validateFields(async (error: any, row: any) => {
      if (error) {
        return;
      }
      const newData: any[] = [...this.state.data];
      const index = newData.findIndex((item: any) => id === item._id);
      if (index > -1) {
        const item = newData[index];
        const data = { _id: item._id, ...row };
        updateAuthorityInfo({ info: [data] }).then(res => {
          if (res.code === 1) {
            newData.splice(index, 1, {
              ...item,
              ...row,
            });
            message.success('更新成功');
            this.setState({ data: newData, editingKey: '' });
          }
          this.start();
        }).catch(e => {
          console.log(e);
          message.error('更新失败');
          this.setState({ editingKey: '' });
        });
      }
    });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };

  getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
            </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
            </Button>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => this.searchInput!.select());
      }
    },
    render: (text: any) => {
      if (dataIndex === 'authority_state') {
        text = text == 1 ? '有' : '无';
      }
      return this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
          text
        )
    },
  });

  handleSearch = (selectedKeys: any[], confirm: () => void, dataIndex: string) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters: () => void) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  handleSelectChange = (t: any) => {
    this.setState({ selectedAuthority: t });
  }

  updateAuthority = (state: number) => {
    const { tenantId, selectedAuthority, keys } = this.state;
    if (tenantId && selectedAuthority) {
      updateAuthorityInfo({info: [{tenant_id: tenantId, authority_id: keys.get(selectedAuthority), authority_state: state, authority_name: selectedAuthority }]}).then(res => {
        if (res.code === 1) {
          message.success('操作成功');
        } else {
          message.error('操作失败');
        }
      }).catch(e => {
        message.error('操作失败');
      });
    } else {
      message.warn('请填写租户id并选择权限');
    }
  }

  render() {
    const { loading, selectedRowKeys, data } = this.state;
    const map: Map<string, string> = this.state.keys;
    const optionList = [];
    for (const n of map) {
      optionList.push(n);
    }
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: any) => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    const pageSize = 20;
    return (
      <div className="gutter-example">
        <BreadcrumbCustom first="权限管理" />
        <Row gutter={16}>
          <Col className="gutter-row" md={24}>
            <div className="gutter-box">
              <Card title="权限信息" bordered={false}>
                <div style={{ marginBottom: 16 }}>
                  <Button
                    type="primary"
                    onClick={this.start}
                    disabled={loading}
                    loading={loading}
                  >
                    刷新
                                    </Button>
                  <span style={{ marginLeft: 8 }}>
                    {hasSelected
                      ? `选中 ${selectedRowKeys.length} 项`
                      : ''}
                  </span>
                </div>
                <Table
                  components={components}
                  table-layout="auto"
                  rowSelection={rowSelection as TableRowSelection<any>}
                  columns={columns}
                  dataSource={data}
                  rowKey={data => data._id}
                  rowClassName={(record: any, index: number) => 'editable-row'}
                  pagination={{ pageSize }}
                />
                {/* <Pagination pageSize={20} /> */}
              </Card>
            </div>
          </Col>
        </Row>
        <Row gutter={4}>
          <Col span={8}>
            <Input addonBefore="租户id" onChange={v => this.setState({ tenantId: v.target.value})} />
          </Col>
          <Col span={6}>
            <Select
              defaultValue={optionList.length > 0 ? optionList[0][0] : ''}
              showSearch
              onChange={(e: any) => this.setState({ selectedAuthority: e })}
            >
              {optionList.map(n => <Option value={n[0]} >{n[0]}</Option>)}
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: '10px'}}>
          <Button style={{marginRight: '20px'}} type="primary" onClick={() => this.updateAuthority(1)}>赋予权限</Button>
          <Button type="danger" onClick={() => this.updateAuthority(0)}>收回权限</Button>
        </Row>
      </div>
    );
  }
}

export default AuthorityManagement;