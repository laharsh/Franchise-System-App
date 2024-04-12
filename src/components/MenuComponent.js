import React, { Component } from 'react';
import { menu } from '../shared/apiService';
import { Button } from 'reactstrap';
import TableCountInput from './CustominputComponent';
import  home from '../shared/images/Home.jpg';
import  berryblast from '../shared/images/berry\ blast.jpg';
import  Brownie from '../shared/images/Chocolate-Brownie_2.png';
import  buger from '../shared/images/buger\ 2.jpg';
import  chocshake from '../shared/images/choc\ shake.jpg';
import  drinks from '../shared/images/fountain-drinks.jpg';
import  badking from '../shared/images/badking.jpg';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            branchname: this.props.selectedBranch,
            itemCount:1,
            menuItems: [],
            loading: false,
            error: null,
            fetchMenuData: null
        };
        this.handleitemCountChange= this.handleitemCountChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.fetchMenu = this.fetchMenu.bind(this);
    }

    handleitemCountChange = (value) => {
        this.setState({ itemCount: value });
    };

    handleClick = (value1,value2) =>{
        this.props.onCart(value1,value2);
    };

   
    fetchMenu = async () => {
        try {
            const data = await menu(this.state.branchname);
            if (!this.unmounted) {
                this.setState({ menuItems: data });
            }
        } catch (error) {
            if (!this.unmounted) {
                this.setState({ error: 'Error fetching menu items' });
            }
        }
    }

    componentDidMount() {
        this.fetchMenu();
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    render() {
        const { menuItems, loading, error } = this.state;
        const images =[berryblast,Brownie,buger,chocshake,drinks,badking,home,Brownie,buger];

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        return (
            this.state.branchname ? (
            <div className="wrap">
            <div className="container">
                    <div className="col-12 " style= {{ paddingTop: '50px'}}>
                    <div className="res-header" style = {{margin: '10px 0 44px 7px' }}> Menu of {this.state.branchname} Branch</div>
                    {this.state.menuItems.map((item, index) => (
                            <div key={index} className="menu-test">
                               <img className="image" src={images[index]} />
                               <div className= "mob-cont">
                                    <div className="itemname">{item.itemname}</div>
                                    <div className="itemprice">{item.itemprice} $</div>
                                    <Button className="menu-bttn" onClick={() => this.handleClick(item.itemprice,item.itemname)} >
                                        Add to cart
                                    </Button>
                                </div>
                            </div>
                        ))} 
                    </div>
            </div>
            </div>
            ):(
                <div className="wrap">
                <div className="container">
                    <span>Please Select a Branch to view the menu</span>
                </div>
                </div>
            )
        );
    }
}

export default Menu;
