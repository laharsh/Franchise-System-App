import React, { Component } from 'react';
import TableCountInput from './CustominputComponent';
import {favourites} from '../shared/apiService';
import {getfavourites} from '../shared/apiService';
import {removefavourites} from '../shared/apiService';
import {removecart} from '../shared/apiService';
import {cartitems} from '../shared/apiService';
import {menu} from '../shared/apiService';
import {cart} from '../shared/apiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart  } from '@fortawesome/free-solid-svg-icons';
import AlertBox from "./Alertbox";

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemprices: JSON.parse(localStorage.getItem('items')),
            itemCounts: JSON.parse(localStorage.getItem('itemcounts')),
            subtotal: localStorage.getItem('subtotal'),
            favlist: localStorage.getItem('favlist'),
            menuItems: [],
            alert: false,
            message: ''
        };
        this.handleItemCountChange= this.handleItemCountChange.bind(this);
        this.handleFav= this.handleFav.bind(this);
        this.handCartremove = this.handCartremove.bind(this);
    }
    // Method to handle count change for a specifi item
    handleFav = async (itemname) => {
        if(localStorage.getItem('username') == null){
            let obj = JSON.parse(localStorage.getItem('favlist'));
            if(obj[itemname] == true){
                delete obj[itemname];
                localStorage.setItem('favlist',JSON.stringify(obj));
                this.setState({favlist:obj});
                this.setState({alert: true, message:`${itemname} removed from favourites`},()=>{
                    setTimeout(() => {
                        this.setState({alert:false})
                    }, 2000);
                })
            }
            else{
                obj[itemname]=true;
                this.setState({favlist:obj});
                localStorage.setItem('favlist',JSON.stringify(obj));
                this.setState({alert: true, message:`${itemname} added to favourites`},()=>{
                    setTimeout(() => {
                        this.setState({alert:false})
                    }, 2000);
                })
            }
        }
        else{
            if(itemname in this.state.favlist == false){
                const data = await favourites(localStorage.getItem('username'),localStorage.getItem('branchname'),itemname) ;
                console.log(data);
                this.setState({alert: true, message:`${itemname} added to favourites`},()=>{
                    setTimeout(() => {
                        this.setState({alert:false})
                    }, 2000);
                })
            }
            if(itemname in this.state.favlist == true){
                const data = await removefavourites(localStorage.getItem('username'),itemname) ;
                console.log(data);
                this.setState({alert: true, message:`${itemname} removed from favourites`},()=>{
                    setTimeout(() => {
                        this.setState({alert:false})
                    }, 2000);
                })
            }
            const getfav =  await getfavourites(localStorage.getItem('username'),localStorage.getItem('branchname'));
            let obj = {};
            getfav.map((item)=>{
                obj[item.itemname]=true;
            })
            this.setState({favlist:obj});
            localStorage.setItem('favlist',JSON.stringify(obj));
        }
   
    }

    handCartremove = async (itemname) => {
        if(localStorage.getItem('username') == null){
            let cnt = this.state.itemCounts;
            let prc = this.state.itemprices;
            localStorage.setItem('itemcounts',  JSON.stringify(cnt));
            this.setState({itemCounts: JSON.parse(localStorage.getItem('itemcounts'))});
            delete prc[itemname];
            localStorage.setItem('items',  JSON.stringify(prc));
        }
        else{
            const dat = await removecart(localStorage.getItem('username'),localStorage.getItem('branchname'),itemname) ;
            const data = await cartitems(localStorage.getItem('username'), localStorage.getItem('branchname'));
            const ic = {};
            data.map((item) => ic[item.itemname]=item.itemcount);
            localStorage.setItem('itemcounts',  JSON.stringify(ic));
            this.setState({itemCounts: JSON.parse(localStorage.getItem('itemcounts'))});
            const [ menuData] = await Promise.all([menu(localStorage.getItem('branchname'))]);
            const it = {};
            const dataItemNames = data.map((item) => item.itemname);
            this.setState({menuItems: menuData},()=>{
                this.state.menuItems.map((item)=>{
                    if(dataItemNames.includes(item.itemname)){
                        it[item.itemname] = item.itemprice;
                    }
                })
                localStorage.setItem('items', JSON.stringify(it));
            }) 
        }
        this.setState({alert: true, message:`${itemname} removed`},()=>{
            setTimeout(() => {
                this.setState({alert:false})
            }, 2000);
        })
    }

    handleItemCountChange = async(itemname, count) => {
        // localStorage.setItem(item)
        // let itemCounts= {};
        console.log('entered');
        const clone = { ...this.state.itemCounts };
        clone[itemname] = count;
        localStorage.setItem('itemcounts', JSON.stringify(clone));
        const data = await cart(localStorage.getItem('username'),localStorage.getItem('branchname'),
                    itemname, count);
        this.setState({ itemCounts: clone },()=>{
            let subtotal = 0;
            Object.entries(this.state.itemCounts).forEach(([itemname, itemcount]) => {
                subtotal += parseFloat(this.state.itemprices[itemname]) * itemcount;
            });
    
            // Check if subtotal has changed before updating state
            if (subtotal !== this.state.subtotal) {
                console.log(subtotal);
                this.setState({ subtotal: subtotal }, () => {
                    // setState callback to ensure subtotal state is updated before calling cartTotal
                    this.props.cartTotal(subtotal);
                });
            }
        });
    };

    async componentDidUpdate(prevProps, prevState) {
        if (prevState.subtotal!== this.state.subtotal || prevState.favlist!== this.state.favlist ){
            if(this.state.itemCounts!=null && Object.entries(this.state.itemCounts)!=null){   
                let subtotal = 0; 
                Object.entries(this.state.itemCounts).forEach(([itemname, itemcount]) => {
                        subtotal += parseFloat(this.state.itemprices[itemname]) * itemcount;
                });
                localStorage.setItem('subtotal',subtotal);
            }
        }
    }

    async componentDidMount(){
        if(localStorage.getItem('username') == null){
            const obj = JSON.parse(localStorage.getItem('favlist'));
            this.setState({favlist:obj});
        }
        else{
            const getfav =  await getfavourites(localStorage.getItem('username'),localStorage.getItem('branchname'));
            let obj = {};
            getfav.map((item)=>{
                obj[item.itemname]=true;
            })
            this.setState({favlist:obj});
            localStorage.setItem('favlist',JSON.stringify(obj));
        }
    }
    

    render() {
        let cartitems = {};
        if(this.state.itemCounts != null){
            if(Object.keys(this.state.itemCounts).length !== 0){
                cartitems = Object.entries(this.state.itemCounts);
            }
        }
        return (
            this.state.itemCounts != null && Object.keys(this.state.itemCounts).length !== 0 ? (
            <div className="wrap">
                <div className="container">
                    <div className="col-12 " style= {{ paddingTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <div className="res-header" style = {{margin: '10px 0 44px 7px' }}>Cart Total : {this.state.subtotal} $</div>
                            <div className="cart-items">
                                {Object.keys(this.state.itemCounts).length !== 0 ?
                                    Object.entries(this.state.itemCounts).map(([itemname, itemcount ]) => (
                                        <div className="item-container" key={itemname}>
                                            <div className="cart-item">
                                                <span>{itemname}</span>
                                                <span style={{cursor:'pointer'}} onClick={() => this.handleFav(itemname)}>
                                                    {this.state.favlist && this.state.favlist[itemname]==true?<FontAwesomeIcon icon={solidHeart}/>
                                                    :<FontAwesomeIcon icon={regularHeart}/>  
                                                    }
                                                </span>
                                            </div>
                                            <div className="cart-item">
                                                <span>Item Total</span>
                                                <span>{(parseFloat(this.state.itemprices[itemname]) * itemcount || 1).toFixed(2)}</span>
                                            </div>
                                            <div className="cart-item">
                                                <span style={{cursor:'pointer',textDecoration: 'underline', color: '#1e7e34'}} onClick={() => this.handCartremove(itemname)}>Remove</span>
                                                <TableCountInput
                                                    value={itemcount || 1} // Set default count to 1 if not set
                                                    min={1}
                                                    max={9}
                                                    onChange={count => this.handleItemCountChange(itemname, count)} // Pass item id and count to handleItemCountChange method
                                                />
                                            </div>
                                        </div>
                                    ))
                                    : ''
                                }
                            </div>
                    </div>
                </div>
                    {this.state.alert && <AlertBox message={this.state.message} />}
            </div>
            ) : (
            <div className="wrap">
                <div className="container">
                <div className="col-12 " style= {{ paddingTop: '50px'}}>
                    <div className="res-header" style = {{margin: '10px 0 44px 7px' }}>Your cart is empty</div>
                </div>
                </div>
            </div>
            )
        );
    }
}

export default Cart;
