import React, { Component , createRef,componentDidMount } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, Jumbotron, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import {login,signup,branches} from '../shared/apiService';
import { menu } from '../shared/apiService';
import { cartitems } from '../shared/apiService';
import "./styles/AboutComponent.Scss";
import AlertBox from "./Alertbox";

class Header extends Component {
    constructor(props) {
        super(props);
    
        this.toggleNav = this.toggleNav.bind(this);
        this.state = {
          isNavOpen: false,
          isMenuOpen: false,
          isModalOpen: false,
          isModalOpen2: false,
          isRegistered: true,
          isBranchesOpen: false,
          username: localStorage.getItem('username'),
          isLoggedIn: false,
          pswrd: '',
          email: '',
          phone: '',
          loginMessage: '', 
          signupMessage: '', 
          branches: [],
          selectedBranch: '',
          menu: [],
          selectedBranch: localStorage.getItem('branchname'),
          subtotal: localStorage.getItem('subtotal'),
          itemCounts: JSON.parse(localStorage.getItem('itemcounts')),
          alert: false,
          message: '',
          selectedItem: localStorage.getItem('branchname')
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.toggleModal2 = this.toggleModal2.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.toggleBranches = this.toggleBranches.bind(this);
        this.handleBranchClick = this.handleBranchClick.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
    }
     
      toggleModal() {
        this.setState({
          isModalOpen: !this.state.isModalOpen,
          loginMessage: ''
        });
      }
      toggleModal2() {
        this.setState({
          isModalOpen2: !this.state.isModalOpen2,
        //   loginMessage: ''
        });
        // if (this.state.isModalOpen2 === false) {
        //     this.setState({ loginMessage: '', signupMessage: '' });
        // }        
      }
      toggleMenu() {
        this.setState({
            isMenuOpen: !this.state.isMenuOpen
        });
    }
    toggleBranches() {
        this.setState({isBranchesOpen: !this.state.isBranchesOpen});
    }
    
    handleBranchClick = async (branchName) => {
        this.props.onBranchSelect(branchName);
        this.setState({selectedItem:branchName})
        localStorage.setItem('branchname', branchName);
        if (localStorage.getItem('username') != null && localStorage.getItem('branchname') != null) {
            try {
                const data = await cartitems(localStorage.getItem('username'), localStorage.getItem('branchname'));
                const ic = {};
                data.map((item) => ic[item.itemname]=item.itemcount);
                localStorage.setItem('itemcounts',  JSON.stringify(ic));
            } catch (error) {
                console.error('Error retrieving cart items:', error);
            }
        }
      }

      handleLogin = async (event) => { // Mark the function as async
        event.preventDefault();
        try {
            const { username, pswrd } = this.state;
            const data = await login(username, pswrd);
            this.setState({ loginMessage: data.message ? data.message : data.error }, () => {
                // Close modal after a delay if login was successful
                if (data.message === 'Login successful') {
                    // If login successful, store username in local storage
                    localStorage.setItem('username', username);
                    this.props.onUserset(username);
                    setTimeout(this.toggleModal, 1000); // Close modal after 2 seconds
                    this.setState({ loginMessage: '' });
                    this.setState({ isLoggedIn: true });
                    this.setState({alert:true,message:'Login successful'},()=>{
                        setTimeout(() => {
                            this.setState({alert:false})
                        }, 4000);
                    });
                }
                if (this.state.loginMessage === 'Invalid username or password') {
                    this.toggleModal2();
                }
            });
            if (localStorage.getItem('branchname') != null && localStorage.getItem('username') != null) {
                try {
                    const data = await cartitems(localStorage.getItem('username'), localStorage.getItem('branchname'));
                    console.log(data);
                    const ic = {};
                    data.map((item) => ic[item.itemname] = item.itemcount);
                    localStorage.setItem('itemcounts', JSON.stringify(ic));
                } catch (error) {
                    console.error('Error retrieving cart items:', error);
                }
            }
        } catch (error) {
            console.error('Error logging in:', error);
            this.setState({ loginMessage: 'An error occurred while logging in' });
        }
    }

    
      handleLogout = () => {
        // Perform logout logic
        
        // Remove username from local storage
        localStorage.removeItem('username');
        const initialItems = {};
        const jsonString = JSON.stringify(initialItems);
        localStorage.setItem('items', jsonString);
        localStorage.setItem('itemcounts', jsonString);
        this.props.onUserset(localStorage.getItem('username'));
        // Update state to reflect logout
        this.setState({isLoggedIn: false, username: null });
        this.setState({alert:true,message:'Logout successful'},()=>{
            setTimeout(() => {
                this.setState({alert:false})
            }, 4000);
        });
    }
      
      handleSignup = async (event) => {
        event.preventDefault();
        try {
            const { username, pswrd, email, phone } = this.state;
            const data = await signup(username, pswrd, email, phone);
            this.setState({ signupMessage: data.message ? data.message : data.error }, () => {
                if (data.message === 'Registration success') {
                    setTimeout(this.toggleModal, 2000);
                    this.state.signupMessage=''; // Close modal after 2 seconds
                }
                if( this.state.signupMessage === 'Username already exists'){
                    this.toggleModal2();
                    console.log(this.state.isModalOpen2);
                }
            });
        } catch (error) {
            console.error('Error signing up:', error);
        }
      };

      toggleNav() {
        this.setState({
          isNavOpen: !this.state.isNavOpen
        });
      }

      async componentDidMount() {
        try {
            const branchesData = await branches(); 
            this.setState({ isLoggedIn: !!this.state.username , branches: branchesData });
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    }


    async componentDidUpdate(prevProps, prevState) {
        if (
            prevState.selectedBranch !== this.state.selectedBranch ||
            prevState.itemCounts !== this.state.itemCounts
        ) {
            try {
                const menuData = await Promise.all(menu(this.state.selectedBranch));
                this.setState({
                    menu: menuData
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.subtotal !== this.props.subtotal) {
            console.log(this.props.subtotal, 'props of header');
            this.setState({ subtotal: this.props.subtotal });
        }
    
        if (prevProps.propfromcart !== this.props.propfromcart) {
            console.log(this.props.propfromcart, 'props from cart');
            this.setState({ subtotal: this.props.propfromcart });
        }
    }
    
    render() {
        const { isLoggedIn, username, subtotal} = this.state;
        return(
            <div className='about' style= {{backgroundColor: '#eaece5' }}>
                <Navbar dark expand="md">
                    <div className="container">
                        <div className="nav-mob">
                        <div className="nav-mob-left">
                            <div className="mobile-nav-icon" >
                                <FontAwesomeIcon   icon={faBars} size="sm" style={{color: "#e3f2ed", width:'31px', height:'31px'}} onClick={this.toggleNav} />
                                <NavbarBrand style= {{ marginLeft: '10px'}} className="mr-auto" href="/"><img src='assets/images/logo.png' height="30" width="41" alt='Ristorante Con Fusion' /></NavbarBrand>
                            </div>
                            <Collapse isOpen={this.state.isNavOpen} navbar>
                                <Nav className="header-left" navbar>
                                    <NavItem>
                                        <NavLink className="nav-link"  to='/home'><span className="fa fa-home fa-lg"></span> Home</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className="nav-link" to='/reservations'><span className="fa fa-info fa-lg"></span> Reservations</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className="nav-link"  to='/menu'><span className="fa fa-list fa-lg"></span> Menu</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className="nav-link" to='/contactus'><span className="fa fa-address-card fa-lg"></span> Contact Us</NavLink>
                                    </NavItem>
                                </Nav>
                            </Collapse>
                        </div>
                        <Nav className="header-right" navbar>
                                <NavItem>
                                    {this.state.isLoggedIn == true ? (
                                        <div className="nav-link logout" to='/contactus'>
                                            
                                            <Button outline onClick={this.handleLogout}>Logout</Button>
                                            
                                        </div>
                                    ) : 
                                        <Button className="log-sgn-btn" outline onClick={this.toggleModal}>
                                            <span className="mar fa fa-sign-in fa-lg"></span> 
                                        Login/Signup</Button>
                                    }
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/cart'>
                                        <Button outline >
                                        <span className="mar fa fa-shopping-cart fa-lg"></span>
                                            ${subtotal}
                                        </Button>
                                    </NavLink>
                                </NavItem>
                        </Nav>
                        </div>
                    </div>
                </Navbar>
                {/* {this.state.isMenuOpen && ( */}
                <div className="container">
                    <div className="additional-menu-overlay">
                                    <div className="additional-menu">
                                        {/* <ul className={this.state.isBranchesOpen ? "expanded" : ""}> */}
                                            {/* Branches */}
                                            <ul className= "expanded">
                                            <li className="branches-dropdown" style={{marginTop:'33px'}} onClick={this.toggleBranches}>
                                            <Button className="dropdown-toggle">
                                                {this.state.selectedItem ? this.state.selectedItem + " branch" : 'Select a branch'}
                                            </Button>
                                                {this.state.isBranchesOpen && (
                                                    <ul className="branches-list">
                                                        {this.state.branches.map(branch => (
                                                        <li style={{paddingBottom: '5px',cursor:'pointer'}} key={branch.branchname} onClick={() => this.handleBranchClick(branch.branchname)}>
                                                                {branch.branchname}
                                                        </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        </ul>
                                    </div>
                    </div>
                </div>
                    {/* )} */}
                {this.state.isRegistered ?
                    <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}>
                            {this.state.loginMessage == 'Login successful' ? 'Login Result' : 'Login'}
                        </ModalHeader>
                        {this.state.loginMessage == 'Login successful' ? (
                            <ModalBody>
                                <div>
                                    <p>{this.state.loginMessage}</p>
                                    {this.state.loginMessage === 'Login successful' && (
                                        <p>You will be redirected shortly...</p>
                                    )}
                                </div>
                            </ModalBody>
                        ) : 
                            <ModalBody>
                                <Form onSubmit={this.handleLogin}>
                                    <FormGroup>
                                        <Label htmlFor="username">Username</Label>
                                        <Input type="text" id="username" name="username"
                                        value={this.state.username}
                                        onChange={(e) => this.setState({ username: e.target.value })} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="pswrd">pswrd</Label>
                                        <Input type="password" id="pswrd" name="pswrd"
                                        value={this.state.pswrd}
                                        onChange={(e) => this.setState({ pswrd: e.target.value })}
                                        />
                                    </FormGroup>
                                    <Button type="submit" value="submit" className="btn-login">Login</Button>
                                </Form>
                                <br></br>
                                <ModalHeader>Don't have an account ?</ModalHeader>
                                <Button onClick={() => this.setState({isRegistered : false})} value="submit" className="btn-login">Signup</Button>
                            </ModalBody> 
                        }
                    </Modal>
                     : 
                    <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}>
                        {this.state.signupMessage == 'Registration success' ? 'Signup Result' : 'Signup'}
                        </ModalHeader>
                        {this.state.signupMessage == 'Registration success' ? (
                            <ModalBody>
                                <div>
                                    <p>{this.state.signupMessage}</p>
                                    {this.state.signupMessage === 'Registration success' && (
                                        <p>You will be redirected shortly, Please Login Again...</p>
                                    )}
                                </div>
                            </ModalBody>
                        ) : 
                            <ModalBody>
                                <Form onSubmit={this.handleSignup}>
                                    <FormGroup>
                                        <Label htmlFor="username">Username</Label>
                                        <Input type="text" id="username" name="username"
                                        value={this.state.username}
                                        onChange={(e) => this.setState({ username: e.target.value })} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="pswrd">pswrd</Label>
                                        <Input type="password" id="pswrd" name="pswrd"
                                        value={this.state.pswrd}
                                        onChange={(e) => this.setState({ pswrd: e.target.value })} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="email">Email</Label>
                                        <Input type="email" id="email" name="email"
                                        value={this.state.email}
                                        onChange={(e) => this.setState({ email: e.target.value })}  />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input type="phone" id="phone" name="phone"
                                        value={this.state.phone}
                                        onChange={(e) => this.setState({ phone: e.target.value })} />
                                    </FormGroup>
                                    <Button className="btn-login" type="submit" value="submit">Signup</Button>
                                </Form>
                                <br></br>
                                <ModalHeader>Already have an account ?</ModalHeader>
                                <Button onClick={() => this.setState({isRegistered : true})} value="submit" className="btn-login">Login</Button>
                            </ModalBody>
                        }
                    </Modal>    
                } 
                {this.state.loginMessage == 'Invalid username or password' || this.state.signupMessage == 'Username already exists' ?
                    <Modal isOpen={this.state.isModalOpen2} toggle={this.toggleModal2}>
                        <ModalHeader toggle={this.toggleModal2}>
                        {this.state.loginMessage?
                           'Login Result' : 'Signup Result' 
                        }
                        </ModalHeader>
                        <ModalBody>
                        {this.state.loginMessage ?
                            this.state.loginMessage : this.state.signupMessage
                        }  
                        </ModalBody>
                    </Modal>
                : "" 
                }
                {this.state.alert && <AlertBox message={this.state.message} />}
            </div>
            
        );
    }
}

export default Header ;