import React from 'react';
import { Row, Col, Card, message } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
// @ts-ignore
import BMap from 'BMap';
import { getParkingList, getParkinglotState } from '../../axios';
import EchartsArea from '../charts/EchartsArea';

const FreeIcon = 'https://s1.ax1x.com/2020/04/25/JyQPyt.png';
const BusyIcon = 'https://s1.ax1x.com/2020/04/25/JyQiOP.png';
const FullIcon = 'https://s1.ax1x.com/2020/04/25/JyQCQI.png';
const NormalIcon = 'https://s1.ax1x.com/2020/04/20/JM0ABt.png';

class Dashboard extends React.Component<any, {parkingList: [], parkinglotState: [],}> {
  constructor(props: any) {
    super(props);
    this.state = {
      parkingList: [],
      parkinglotState: [],
    }
  }
  async componentDidMount() {
    const map = new BMap.Map('map');
    this.map = map;
    const initialPoint = new BMap.Point(113.93041, 22.53332);
    map.centerAndZoom(initialPoint, 16);
    map.setMapStyleV2({     
      styleId: '3a4c662b58e036c10d4238cc262d6930'
    });
    map.enableScrollWheelZoom(true);
    map.clearOverlays();
    map.addControl(new BMap.NavigationControl());
    map.addControl(new BMap.ScaleControl());
    map.addControl(new BMap.MapTypeControl());
    map.addControl(new BMap.GeolocationControl());
    // const geolocation = new BMap.Geolocation();
    // geolocation.getCurrentPosition(function(r: any){
    //   // @ts-ignore
    //     // map.centerAndZoom(r.point, 14);
    //   if (this.getStatus() === window.BMAP_STATUS_SUCCESS)
    //   // @ts-ignore
    //     var mk = new BMap.Marker(r.point);
    //     map.addOverlay(mk);
    //     map.panTo(r.point);
    //   });
    await this.searchParkingLot();
    await this.updateParkinglotState();
    this.addLayout();
  }
  map: any;

  updateParkinglotState = async () => {
    await getParkinglotState().then(
      (res: any) => {
        if (res && res.code === 1) {
          this.setState({parkinglotState: res.data});
        } else {
          message.error('获取停车场状态失败: ' + res.errMsg);
        }
      },
      (err: Error) => {
        message.error('获取停车场状态失败: ' + err.message);
      });
  }

  searchParkingLot = async () => {
    await getParkingList().then(res => {
      this.setState({ parkingList: res.results });
    }).catch(e => {
      message.error(e);
    });
  }

  addLayout() {
    const { parkinglotState, parkingList } = this.state;

    parkingList.forEach((p: any) => {
      const point = new BMap.Point(p.location.lng, p.location.lat);
      const state: any = parkinglotState.filter((s: any) => s.name == p.name)[0];
      let iconUrl = NormalIcon;
      if (state) {
        const idleRatio = state.idle_num / state.carport_num;
        if ( idleRatio > 0.5) {
          iconUrl = FreeIcon;
        } else if (idleRatio === 0) {
          iconUrl = FullIcon;
        } else {
          iconUrl = BusyIcon;
        }
      }
      const icon = new BMap.Icon(iconUrl, new BMap.Size(32, 32));
      const marker = new BMap.Marker(point, {icon, title: p.name});

      const infoWindow = new BMap.InfoWindow(state ? `
        <div style="display: flex;flex-direction: column">
          <div>停车场：${state.name}</div>
          <div>车位： <span style="color: green">${state.idle_num}</span> / ${state.carport_num}</div>
        </div>` : '暂无该停车场数据'
      );
      // <div><a href="#/app/carport/management?parkinglot_id=${state.parkinglot_id}">查看详情</a></div>
      marker.addEventListener('click', () => this.map.openInfoWindow(infoWindow, point));
      this.map.addOverlay(marker);

    });
  }

  render() {
    return (
      <div className="gutter-example button-demo">
        <BreadcrumbCustom />
        <Row gutter={10}>
          {/* <Col className="gutter-row" md={4}>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="clear y-center">
                                    <div className="pull-left mr-m">
                                        <Icon type="heart" className="text-2x text-danger" />
                                    </div>
                                    <div className="clear">
                                        <div className="text-muted">收藏</div>
                                        <h2>301</h2>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="clear y-center">
                                    <div className="pull-left mr-m">
                                        <Icon type="cloud" className="text-2x" />
                                    </div>
                                    <div className="clear">
                                        <div className="text-muted">云数据</div>
                                        <h2>30122</h2>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col className="gutter-row" md={4}> */}
          {/* <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="clear y-center">
                                    <div className="pull-left mr-m">
                                        <Icon type="camera" className="text-2x text-info" />
                                    </div>
                                    <div className="clear">
                                        <div className="text-muted">照片</div>
                                        <h2>802</h2>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div className="gutter-box">
                            <Card bordered={false}>
                                <div className="clear y-center">
                                    <div className="pull-left mr-m">
                                        <Icon type="mail" className="text-2x text-success" />
                                    </div>
                                    <div className="clear">
                                        <div className="text-muted">邮件</div>
                                        <h2>102</h2>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Col> */}
          <Col className="gutter-row" >
            <div className="gutter-box">
              <Card bordered={false} className={'no-padding'}>
                {/* <EchartsProjects /> */}
                <EchartsArea />
              </Card>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="gutter-row" span={50}>
            <div id="map" style={{height: '80vh'}} />
          </Col>
        </Row>
      </div>
    )
  }
}

export default Dashboard;