import React from 'react';
import { Row, Col, Card, Timeline, Icon, message } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import EchartsViews from './EchartsViews';
import EchartsProjects from './EchartsProjects';
import b1 from '../../style/imgs/b1.jpg';
// @ts-ignore
import BMap from 'BMap';
import { getParkingList } from '../../axios';

class Dashboard extends React.Component<any, {parkingList: []}> {
  constructor(props: any) {
    super(props);
    this.state = {
      parkingList: [],
    }
  }
  componentDidMount() {
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
    this.searchParkingLot();

  }
  map: any;

  searchParkingLot() {
    getParkingList().then(res => {
      this.setState({ parkingList: res.results }, () => this.addLayout());
    }).catch(e => {
      message.error(e);
    });
  }

  addLayout() {
    const parkingList = this.state.parkingList;
    const icon = new BMap.Icon('https://s1.ax1x.com/2020/04/20/JM0ABt.png', new BMap.Size(32, 32));

    parkingList.forEach((p: any) => {
      const point = new BMap.Point(p.location.lng, p.location.lat);
      const marker = new BMap.Marker(point, {icon, title: p.name});
      marker.addEventListener('click', () => {
        const infoWindow = new BMap.InfoWindow(`
          <div>
            <p>div content</p>
            <p>div content</p>
            <p>div content</p>
          </div>`
        );
        this.map.openInfoWindow(infoWindow, point);
      });
      this.map.addOverlay(marker);
    })
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
                <EchartsProjects />
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