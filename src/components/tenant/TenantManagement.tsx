import React from "react";
import BreadcrumbCustom from "../BreadcrumbCustom";
import { Row, Col, Card, Button, Table, Form, Popconfirm, InputNumber, Input, message, Icon } from "antd";
import { TableRowSelection } from "antd/lib/table";
import { updateTenantInfo, getTenantInfo, deleteTenant } from "../../axios";
import Highlighter from 'react-highlight-words';

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

class TenantManagement extends React.Component {
  constructor(props: any) {
    super(props);
    this.columns = [
      {
          title: '租户实体',
          dataIndex: 'tenant_entity',
          // width: 80,
          editable: true,
          ...this.getColumnSearchProps('tenant_entity'),
      },
      {
        title: '地址',
        dataIndex: 'address',
        // width: 80,
        editable: true,
        ...this.getColumnSearchProps('address'),
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
    editingKey: '',
    searchText: '',
    searchedColumn: '',
  };
  componentDidMount() {
    this.start();
  };

  searchInput: Input | null = null;
  columns: any[];

  start = async () => {
    this.setState({ loading: true });
    await getTenantInfo().then(({ code, data }: { code: number, data: any[] }) => {
      this.setState({
        data,
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
              const data = {_id: item._id, ...row};

              updateTenantInfo({info: [data]}).then(res => {
                if (res && res.code === 1) {
                  newData.splice(index, 1, {
                    ...item,
                    ...row,
                  });
                  message.success('更新成功');
                  this.setState({ data: newData, editingKey: '' });
                }
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
    render: (text: any) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
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

  delete = async() => {
    const data: string[] = this.state.selectedRowKeys;
    await deleteTenant(data).then(async ({code}: {code: number}) => {
      if (code === 1) {
        this.setState({ selectedRowKeys: [] });
        await this.start();
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
    }).catch(e => {
      message.error('删除失败,' + e.message);
    });
  }

  render() {
    const { loading, selectedRowKeys, data } = this.state;
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
        <BreadcrumbCustom first="租户信息管理" />
        <Row gutter={16}>
          <Col className="gutter-row" md={24}>
            <div className="gutter-box">
              <Card title="租户信息" bordered={false}>
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
                  <Button
                    type="danger"
                    onClick={this.delete}
                    disabled={loading || selectedRowKeys.length === 0}
                    loading={loading}
                    style={{float: "right", marginRight: "40px"}}
                  >
                    删除选中
                  </Button>
                </div>
                <Table
                  components={components}
                  table-layout="auto"
                  rowSelection={rowSelection as TableRowSelection<any>}
                  columns={columns}
                  dataSource={data}
                  rowKey={data => data._id}
                  rowClassName={(record: any, index: number) => 'editable-row'}
                  pagination={{pageSize}}
                />
                {/* <Pagination pageSize={20} /> */}
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default TenantManagement;