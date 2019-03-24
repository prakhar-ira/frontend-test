import React, { Component } from 'react';
import './App.css';
import ReactEcharts from 'echarts-for-react';
import ReactTable from "react-table";
import "react-table/react-table.css";


class App extends Component {
  constructor() {
    super();
    this.state = {
      data:[{
        deviceId: 101,
        temperature: 45,
        battery: '50%',
        lastConnectedTime: '1:40 PM',
        simNo: '9909128900',
        imei: '99001287772890203'
      },{
        deviceId: '102',
        temperature: 48,
        battery: '40%',
        lastConnectedTime: '2:40 PM',
        simNo: '9909123400',
        imei: '990012877734520203'
      },{
        deviceId: '103',
        temperature: 55,
        battery: '78%',
        lastConnectedTime: '2:10 PM',
        simNo: '9909273700',
        imei: '1934012877734520203'
      },{
        deviceId: '104',
        temperature: 59,
        battery: '71%',
        lastConnectedTime: '1:10 PM',
        simNo: '9909273107',
        imei: '1933928787734520203'
      },{
        deviceId: '105',
        temperature: 79,
        battery: '78%',
        lastConnectedTime: '2:30 PM',
        simNo: '8809273107',
        imei: '21093874789200299'
      },{
        deviceId: '106',
        temperature: 88,
        battery: '89%',
        lastConnectedTime: '4:30 PM',
        simNo: '9908628718',
        imei: '102938239437896234'
      }]
  ,
    };
  }

  componentDidMount() {
    let newData = localStorage.getItem('data'); //getting local storage data
    console.log(localStorage.getItem('data')); 
    this.setState({
      newData
    })
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 19.196619, lng: 72.975504 },
      zoom: 10,
      scaleControl: true
    });
    let infowindow = new window.google.maps.InfoWindow();
    infowindow.setContent('<b>Scroll to zoom in</b>');
    this.addMarker({ lat: 19.196619, lng: 72.975504 }, map, '', infowindow);
    this.addMarker({lat: 19.208413, lng: 72.972091}, map, 'A', infowindow);
    this.addMarker({lat: 19.150972, lng: 72.950253}, map, 'P', infowindow);
    let triangleCoords = [
      {lat: 19.252909, lng: 72.854505},
      {lat: 19.236690, lng: 72.781789},
      {lat: 18.962050, lng: 72.803136},
      {lat: 19.111722, lng: 72.953304},
    ];
    var mumbaiTriangle = new window.google.maps.Polygon({
      paths: triangleCoords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35
    });
    mumbaiTriangle.setMap(map);
  }


  addMarker(location, map, label, infowindow) {
    let marker = new window.google.maps.Marker({
      map: map, 
      position: location,
      label: label
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}
getOption = () => {
  return {
    tooltip : {
      trigger: 'axis'
    },
    legend: {
      data:['Device A','Device B']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis : [
      {
        type : 'category',
        boundaryGap : false,
        data : ['9:00 AM','10:00 AM','11:00 AM','12:00 AM','1 PM','2 PM','3 PM']
      }
    ],
    yAxis : [
      {
        type : 'value'
      }
    ],
    series : [
      {
        name:'Device A',
        type:'line',
        stack: 'Device A',
        areaStyle: {normal: {}},
        data:[78, 82, 88, 95 , 80, 100, 70]
      },
      {
        name:'Device B',
        type:'line',
        stack: 'Device B',
        areaStyle: {normal: {}},
        data:[55, 69, 80, 50, 40, 95, 120]
      },
    ]
  };
};

renderEditable = cellInfo => {
  return (
    <div
      style={{ backgroundColor: "#f5f5f5" }}
      contentEditable
      suppressContentEditableWarning
      onBlur={e => {
        const data = [...this.state.data];
        data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
        this.setState({ data });
        try {
          localStorage.setItem('data', JSON.stringify(data)); //Item is being stored in local storage
          console.log(localStorage.getItem('data'));
        } catch (err){
            return undefined;
        }
      }}
    />
  );
};

  render() {

    const columns = [{
      Header: 'Device Id',
      accessor: 'deviceId',
      Cell: this.renderEditable
    },
    {
      Header: "Temperature('C)",
      accessor: 'temperature',
    },
    {
      Header: 'Battery',
      accessor: 'battery'
    },
    {
      Header: 'Last connected time',
      accessor: 'lastConnectedTime'
    },
    {
      Header: 'Sim no',
      accessor: 'simNo',
      Cell: this.renderEditable
    },
    {
      Header: 'IMEI',
      accessor: 'imei'
    },
  ];

  const { data } = this.state;

    return (
      <div className="map-margin">
        <div style={{ width:1300, height: 500 }} id="map" className='container-margin-bottom'></div>
          <label>Temperature('C) data graph <strong>(time series)</strong></label>
          <ReactEcharts
            option={this.getOption()}
            style={{height: '350px', width: '100%'}}
            className='container-margin-bottom' />
            <h3 className='list-header'>Device list (Enter device Id and sim no. Both are editable fields.)</h3>
          <ReactTable
            data={data}
            columns={columns}
            defaultPageSize = {6}
            pageSizeOptions = {[3, 6]}
            className="-striped -highlight right"
          />
       </div>
    );
  }
}

export default App;
