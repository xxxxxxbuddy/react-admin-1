import React from "react";
import BreadcrumbCustom from "../BreadcrumbCustom";
import { Row, Col, Card, Button, Table, Form, Popconfirm, InputNumber, Input, message, Icon, Modal, Descriptions } from "antd";
import { TableRowSelection } from "antd/lib/table";
import { getUserInfo, updateUserInfo, deleteUser, getCarInfo } from "../../axios";
import Highlighter from 'react-highlight-words';

export interface UserManagementProps {

}

export interface UserManagementState {

}

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

const carPropsMap: any = {
  _id: '车辆ID',
  car_type: '车辆类型',
  car_brand: '车辆品牌',
  car_model: '车辆型号',
  plate_number: '车牌号',
  user_id: '用户ID',
}

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

class UserManagement extends React.Component<UserManagementProps, UserManagementState> {
  constructor(props: any) {
    super(props);
    this.columns = [
      {
          title: '姓名',
          dataIndex: 'name',
          // width: 80,
          editable: true,
          ...this.getColumnSearchProps('name'),
          // render: (text: any, record: any) => (
          //     <a href={record.url} target="_blank" rel="noopener noreferrer">
          //         {text}
          //     </a>
          // ),
      },
      {
        title: '性别',
        dataIndex: 'sex',
        // width: 80,
        editable: true,
        ...this.getColumnSearchProps('sex'),
      },
      {
          title: '身份证号',
          dataIndex: 'id',
          ...this.getColumnSearchProps('id'),
          // width: 200,
      },
      {
          title: '手机号码',
          dataIndex: 'phone',
          // width: 100,
          editable: true,
          ...this.getColumnSearchProps('phone'),
      },
      {
        title: '信用等级',
        dataIndex: 'credit_rating',
        ...this.getColumnSearchProps('credit_rating'),
        // width: 80,
        editable: true,
      },
      {
        title: '车辆信息',
        dataIndex: 'car_info',
        width: 100,
        render: (text: any, record: any) => (
          <a onClick={() => this.showCarInfo(record._id)}>
            点此查看
          </a>
        ),
      },
      {
        title: '订单信息',
        dataIndex: 'order',
        width: 100,
        render: () => (
          <a href=''>
            点此查看
          </a>
        )
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
                                        onClick={() => this.save(form, record.id)}
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
                        <Button onClick={() => this.edit(record.id)}>编辑</Button>
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
    showModal: false,
    modalData: '',
  };
  componentDidMount() {
    this.start();
  };

  searchInput: Input | null = null;
  columns: any[];

  start = async () => {
    this.setState({ loading: true });
    await getUserInfo().then(({ code, data }: { code: number, data: any[] }) => {
      data.forEach(record => record.sex = record.sex === 0 ? '男' : '女');
      this.setState({
        data,
        loading: false,
      });
    }).catch(e => {
      this.setState({ loading: false });
    });
  };

  delete = async() => {
    const data: string[] = this.state.selectedRowKeys;
    await deleteUser(data).then(async ({code}: {code: number}) => {
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

  showCarInfo(_id: string) {
    let info = null;
    getCarInfo(_id).then(res => {
      console.log(res);
      if (res && res.code === 1) {
        info = res.data[0];

        if (info) {
          this.setState({ showModal: true, modalData: info });
        } else {
          message.info('该用户无车辆信息');
        }
      } else {
        message.error('获取车辆信息失败');
      }
    }).catch(e => {
      message.error('获取车辆信息失败' + e.message);
    });
  }

  onSelectChange = (selectedRowKeys: string[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  isEditing = (record: any) => {
    return record.id === this.state.editingKey;
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
          const index = newData.findIndex((item: any) => id === item.id);
          if (index > -1) {
              const item = newData[index];
              const data = {id: item.id, ...row};
              if (data.sex === '男') {
                data.sex = 0;
              } else {
                data.sex = 1;
              }
              updateUserInfo({info: [data]}).then(res => {
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
        <BreadcrumbCustom first="用户信息管理" />
        <Row gutter={16}>
          <Col className="gutter-row" md={24}>
            <div className="gutter-box">
              <Card title="用户信息" bordered={false}>
                <div style={{ marginBottom: 16, position: "relative" }}>
                  <Button
                    type="primary"
                    onClick={this.start}
                    disabled={loading}
                    loading={loading}
                  >
                    刷新数据
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
                <Modal
                  footer={null}
                  width={1000}
                  visible={this.state.showModal}
                  onCancel={() => this.setState({ showModal: false })}
                >
                  <Descriptions title="车辆信息" bordered>
                    {this.state.modalData && Object.entries(this.state.modalData).map(prop => {
                      return prop[0] !== '__v' ? (
                        <Descriptions.Item key={prop[0]} label={carPropsMap[prop[0]]}>{prop[1]}</Descriptions.Item>
                      ) : '';
                    })}
                  </Descriptions>
                </Modal>
                {/* <Pagination pageSize={20} /> */}
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default UserManagement;