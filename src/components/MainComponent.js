import React, { Component } from 'react';
import Menu from './MenuComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import Reservations from './ReservationComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import Cart from './CartComponent';
import {branches} from '../shared/apiService';
import { menu } from '../shared/apiService';
import { cartitems } from '../shared/apiService';
import { cart } from '../shared/apiService';
import { getreservations } from '../shared/apiService';
import { Switch, Route, Redirect, withRouter, Router } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import AlertBox from "./Alertbox";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemCounts: JSON.parse(localStorage.getItem('itemcounts')),
      itemprices: {},
      selectedBranch: localStorage.getItem('branchname'),
      username: localStorage.getItem('username'),
      cartItems:[],
      branches: [],
      menuItems: [],
      subtotal: localStorage.getItem('subtotal'),
      propfromcart: null,
      myreservations: [],
      alert: false,
      message: ''
    };

    this.handleBranchSelection = this.handleBranchSelection.bind(this);
    this.handleUsername  = this.handleUsername.bind(this);
    this.handleCartvalue = this.handleCartvalue.bind(this);
    this.handleCartTotal = this.handleCartTotal.bind(this);
  }

  handleBranchSelection = (branchName) => {
    this.setState({ selectedBranch: branchName });
  }
  handleUsername = (username) =>{
    this.setState({username : username});
  }

  handleCartvalue = async (value1,value2) =>{
    this.setState({alert: true, message:`${value2} added to cart`},()=>{
      setTimeout(() => {
          this.setState({alert:false})
      }, 4000);
    })
    this.setState({ subtotal: JSON.parse(localStorage.getItem('subtotal')) + value1 }, () => {
      localStorage.setItem('subtotal', this.state.subtotal);
    });
    const local = JSON.parse(localStorage.getItem('items'));
    local[value2] = value1;
    const updatedLocal = JSON.stringify(local);
    localStorage.setItem('items', updatedLocal);
    const localcounts = JSON.parse(localStorage.getItem('itemcounts'));
    localcounts[value2] = localcounts[value2] ? localcounts[value2] + 1 : 1;
    const updatedcounts = JSON.stringify(localcounts);
    localStorage.setItem('itemcounts', updatedcounts);
    if(localStorage.getItem('username')!=null){
      const data = await cart(localStorage.getItem('username'),localStorage.getItem('branchname'),
                    value2,localcounts[value2]);
    }
    const newArray = this.state.cartItems.concat({"itemprice": value1, "itemname":value2});
    this.setState({ cartItems: newArray });
  }

  handleCartTotal = (value) =>{
    console.log(value);
    this.setState({propfromcart: value});
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedBranch !== this.state.selectedBranch || prevState.username !== this.state.username) {
      try {
        const [branchesData, menuData, myres] = await Promise.all([
          branches(),
          menu(this.state.selectedBranch),
          getreservations(localStorage.getItem('username'),localStorage.getItem('branchname'))
        ]);
        // Assuming 'reservations' is your array of reservations

        // Step 1: Sort the array based on 'res_date'
        myres.sort((a, b) => new Date(a.res_date) - new Date(b.res_date));

        // Step 2: Filter out only the upcoming reservations
        const today = new Date();
        const upcomingReservations = myres.filter(reservation => {
            const reservationDate = new Date(reservation.res_date);
            return reservationDate > today;
        });
        this.setState({myreservations: upcomingReservations})
        const data = await cartitems(localStorage.getItem('username'), localStorage.getItem('branchname'));
        const it = {};
        const dataItemNames = data.map((item) => item.itemname);
        this.setState({branches: branchesData,menuItems: menuData},()=>{
          this.state.menuItems.map((item)=>{
            if(dataItemNames.includes(item.itemname)){
                it[item.itemname] = item.itemprice;
            }
          }) 
        localStorage.setItem('items', JSON.stringify(it));
        });
        if(localStorage.getItem('itemcounts')!=null){
          this.setState({itemprices:it},()=>{
            let subtotal = 0; 
            Object.entries(JSON.parse(localStorage.getItem('itemcounts'))).forEach(([itemname, itemcount]) => {
              subtotal += parseFloat(this.state.itemprices[itemname]) * itemcount;
            });
            localStorage.setItem('subtotal',JSON.stringify(subtotal));
          })
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }
  
  async componentDidMount() {
    try {
      if(localStorage.getItem('username') != null && localStorage.getItem('branchname') != null){
        const myres = await getreservations(localStorage.getItem('username'),localStorage.getItem('branchname'));
        // Assuming 'reservations' is your array of reservations

        // Step 1: Sort the array based on 'res_date'
        myres.sort((a, b) => new Date(a.res_date) - new Date(b.res_date));

        // Step 2: Filter out only the upcoming reservations
        const today = new Date();
        const upcomingReservations = myres.filter(reservation => {
            const reservationDate = new Date(reservation.res_date);
            return reservationDate > today;
        });
        this.setState({myreservations: upcomingReservations});
      }
      if(localStorage.getItem('items') === null){
        const initialItems = {};
        const jsonString = JSON.stringify(initialItems);
        localStorage.setItem('items', jsonString);
      }
      if(localStorage.getItem('itemcounts') === null){
        const initialItems = {};
        const jsonString = JSON.stringify(initialItems);
        localStorage.setItem('itemcounts', jsonString);
        localStorage.setItem('subtotal', 0);
      }
      if(localStorage.getItem('favlist') === null){
        const initialItems = {};
        const jsonString = JSON.stringify(initialItems);
        localStorage.setItem('favlist', jsonString);
      }
  } catch (error) {
      console.error('Error fetching branches:', error);
  }
  }

  render() {
    const { selectedBranch, username, branches, cartItems, menuItems, myreservations} = this.state;
    const HomePage = () => {
      return(
        <></>
      );
    }

    const DishWithId = ({match}) => {
      return(
        <></>
      );
    };

    return (    
      
      <div>
        {this.state.alert && <AlertBox message={this.state.message} />}
        <Header onBranchSelect={this.handleBranchSelection} onUserset={this.handleUsername} branches={branches} subtotal={this.state.subtotal} propfromcart={this.state.propfromcart} menuItems={menuItems} />
          <div>
            <TransitionGroup>
                <CSSTransition  classNames="page" timeout={300}>
                  <Switch location={this.props.location}>
                        <Route path='/home' component={()=> <Home myreservations={myreservations}/>} />
                        <Route path='/reservations' component={() => <Reservations selectedBranch={selectedBranch} user={username} branches={branches}/>} />
                        <Route exact path='/aboutus' component={() => <About leaders={this.props.leaders} />} />
                        <Route exact path='/menu' component={() => <Menu selectedBranch={selectedBranch} onCart={this.handleCartvalue} />} />
                        <Route exact path='/cart' component={() => <Cart cartItems={cartItems} cartTotal={this.handleCartTotal} menuItems={menuItems} />} /> 
                        <Route path='/menu/:dishId' component={DishWithId} />
                        <Route exact path='/contactus' component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} />} />
                        <Redirect to="/home" />
                  </Switch>
                </CSSTransition>
            </TransitionGroup>
          </div>
        <Footer />
      </div>
      
    );
  }
}

export default Main;

