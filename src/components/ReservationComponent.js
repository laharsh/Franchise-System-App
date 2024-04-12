import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Jumbotron } from 'reactstrap'; // You might need to import these components from 'react-bootstrap' or another UI library
import { tabl , reservations, branches } from '../shared/apiService'; // Assuming you have an API function to get table types
import TableCountInput from './CustominputComponent';
import AlertBox from "./Alertbox";

class Reservations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.user,
      branchname: this.props.selectedBranch,
      tableTypes: [],
      selectedTableType: '',
      tableCount: 1,
      max:1,
      date: new Date().toISOString().split('T')[0],
      timeSlot: '',
      reservationMessage: '',
      branchname : localStorage.getItem('branchname'),
      branches: [], 
      branchOpenTime: '', // Example opening time
      branchCloseTime: '', // Example closing time
      timeSlots: [],
      alert: false,
      message: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleTableCountChange = this.handleTableCountChange.bind(this);
    this.calculateTimeSlots= this.calculateTimeSlots.bind(this);
    this.handleTimeChange= this.handleTimeChange.bind(this);
    this.convertTimeTo24HourFormat= this.convertTimeTo24HourFormat .bind(this);
  }

  async componentDidMount() {
    try {
      const [branchesData,data] = await Promise.all([
        branches(),tabl(this.state.branchname)]);
        this.setState({
            branches: branchesData,
            tableTypes: data,
            loading: false
        });
        this.calculateTimeSlots();
        
    } catch (error) {
        this.setState({
            loading: false,
            error: 'Error fetching tables'
        });
    }
  }

  // Function to calculate time slots based on branch open and close times
  calculateTimeSlots = () => {
    this.state.branches.filter((branch = this.state.branchname)=>{
        this.setState({branchOpenTime: branch.opentime,branchCloseTime: branch.closetime})
    })

    const { branchOpenTime, branchCloseTime } = this.state;
    const startTime = new Date(`2000-01-01 ${branchOpenTime}`);
    const endTime = new Date(`2000-01-01 ${branchCloseTime}`);
    const timeSlots = [];
    // Start with the opening time
    let currentTime = startTime;
    while (currentTime <= endTime) {
      timeSlots.push(currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      // Increment by 1 hour
      currentTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
    }
    this.setState({ timeSlots });
    // console.log(timeSlots);
  };
  
  handleInputChange = (event) => {
    const { value } = event.target;
    console.log("Selected table type:", value);

    // Filter tableTypes array based on the selected table type
    const filteredTables = this.state.tableTypes.filter(table => table.tabletype === value);
    console.log("Filtered tables:", filteredTables);

    // Assuming there's only one matching table type, set the table count accordingly
    if (filteredTables.length > 0) {
        const tableCount = filteredTables[0].count;
        const type = filteredTables[0].tabletype;
        console.log("Table count:", tableCount);
        this.setState({ tableCount: tableCount, max:tableCount , selectedTableType: type });
    } else {
        // If no matching table type found, set table count to 0 or any default value
        console.log("No matching table type found");
        this.setState({ tableCount: 0 });
    }
}

  handleDateChange = (event) => {
    this.setState({date: event.target.value});
  };

  handleTimeChange = (event) => {
    const time12h = event.target.value; // Assuming event.target.value is in 12-hour format like "11:00 AM"
    const time24h = this.convertTimeTo24HourFormat(time12h);
    this.setState({ timeSlot: time24h ? time24h : '' }, () => {
      console.log(this.state.timeSlot); // Ensure that timeSlot is updated
    });
  };
  
  convertTimeTo24HourFormat = (time12h) => {
    const [time, modifier] = time12h.split(' ');
  
    let [hours, minutes] = time.split(':');
  
    if (hours === '12') {
      hours = '00';
    }
  
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
  
    return `${hours}:${minutes}:00`;
  };

  handleTableCountChange = (value) => {
    this.setState({ tableCount: value });
  };

  handleSubmit = async (event) => {
    console.log('on submit');
    event.preventDefault();
    
    const response = this.state.username && this.state.branchname && this.state.date && this.state.timeSlot && this.state.selectedTableType && this.state.tableCount ? 
                    await reservations(this.state.username,this.state.branchname,this.state.date,this.state.timeSlot,this.state.selectedTableType,this.state.tableCount)
                    : '' ;
    this.setState({ reservationMessage: response.message ? response.message : 'Mandatory fields missing'});
    this.setState({ date: new Date().toISOString().split('T')[0],timeSlot:'',selectedTableType:'',tableCount: 1});
    console.log( this.state.reservationMessage);
    if (this.state.reservationMessage !== '') {
      this.setState({ alert: true, message: this.state.reservationMessage },()=>{
        setTimeout(() => {
            this.setState({alert:false})
        }, 4000)});
    }
  }

  render() {
    const { timeSlots, timeSlot } = this.state;
    return (
    this.state.username && this.state.branchname  ?
    <div className="wrap">
      <div className="container">
        <div className="row row-header">
          <div className="col-12 col-sm-6">
          <div className="res-header">Make a Reservation</div>
          <Form onSubmit={this.handleSubmit} >
            <FormGroup>
              <Label className="res-label" for="tableType">Table Type</Label>
              <Input type="select" name="selectedTableType" id="tableType" onChange={this.handleInputChange}>
                <option>Select Table Type</option>
                {this.state.tableTypes.map(table => (
                  <option key={table} value={table.tabletype} >{table.tabletype}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label className="res-label" for="tableCount">Table Count</Label>
              <TableCountInput
                  value={this.state.tableCount}
                  min={1}
                  max={this.state.max}
                  onChange={this.handleTableCountChange}
              />
            </FormGroup>
            <FormGroup>
              <Label className="res-label"  for="date">Date</Label>
              <Input type="date" name="date" id="date"  min={new Date().toISOString().split('T')[0]} value={this.state.date} onChange={this.handleDateChange } />
            </FormGroup>
            <FormGroup>
              <Label className="res-label" for="timeSlot">Time Slot</Label>
              <Input 
              type="select" 
              name="timeSlot" 
              id="timeSlot" 
              value={this.state.timeSlot}
              onChange={this.handleTimeChange}
              >
              <option> {this.state.timeSlot ? this.state.timeSlot : 'Select Time Slot' }</option>
              {timeSlots.map((slot, index) => (
                  <option key={index} value={slot}>{slot}</option>
              ))}
              </Input>
              </FormGroup>
            <Button className="res-bttn" type="submit">Submit Reservation</Button>
          </Form>
          {this.state.reservationMessage=== 'Mandatory fields missing' ? <p className="error-font">{this.state.reservationMessage}</p>:''}
          {this.state.alert && <AlertBox message={this.state.message} />}
          </div>
        </div>
      </div>
    </div>
      :
    this.state.branchname  ?
    <div className="wrap">
      <div className="container">
        <div className="row row-header">
          <div className="col-12 col-sm-6">
          <div className="res-header" style={{ marginBottom: '70px' }}>
            Please Login to make a Reservation
          </div>
          </div>
        </div>
      </div>
    </div>
      :
    this.state.username  ?
    <div className="wrap">
    <div className="container">
      <div className="row row-header">
        <div className="col-12 col-sm-6">
        <div className="res-header" style={{ marginBottom: '70px' }}>
            Please select a Branch  
          </div>
          </div>
        </div>
      </div> 
    </div> :
    <div className="wrap">
    <div className="container">
      <div className="row row-header">
        <div className="col-12 col-sm-6">
        <div className="res-header" style={{ marginBottom: '70px' }}>
        Please Login and Select a Branch to make reservation 
      </div> 
      </div>  
      </div>  
      </div>    
    </div> 
    )}
    
}


export default Reservations;
