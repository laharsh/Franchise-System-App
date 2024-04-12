import React ,{ useState,useEffect} from 'react';
import { Card, CardImg, CardText, CardBody, Jumbotron,
    CardTitle, CardSubtitle,Button} from 'reactstrap';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform } from 'react-animation-components';
import  Homepage from '../shared/images/home.webp';
import  home from '../shared/images/Home.jpg';
import { Link } from 'react-router-dom';
import { cancelreservations } from '../shared/apiService';
import { getreservations } from '../shared/apiService';
import AlertBox from "./Alertbox";

function RenderCard({item, isLoading, errMess}) {

    if (isLoading) {
        return(
                <Loading />
        );
    }
    /*
    else if (errMess) {
        return(
                <h4>{errMess}</h4>
        );
    }
    else 
        return(
            <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                <Card>
                    <CardImg src={baseUrl + item.image} alt={item.name} />
                    <CardBody>
                    <CardTitle>{item.name}</CardTitle>
                    {item.designation ? <CardSubtitle>{item.designation}</CardSubtitle> : null }
                    <CardText>{item.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        );
    */

}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const formattedTime = `${hours % 12 || 12}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
    return formattedTime;
}

async function handlecancelreservation(username,branchname,date,timeslot,tabletype,setMyReservations,setalert,setmessage) {
    const response = await cancelreservations(username,branchname,date,timeslot,tabletype);
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
    setMyReservations(upcomingReservations.slice(0, 2));
    setalert(true);
    console.log(alert);
    setmessage('Reservation Cancelled',()=>{
        setTimeout(() => {
            setalert(false)
        }, 4000);
    })

}

function Home(props) { 
    const [myReservations, setMyReservations] = useState(props.myreservations.slice(0, 2));
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const username = localStorage.getItem('username');
    const branchname = localStorage.getItem('branchname');
    const [alert , setalert ] = useState(false);
    const [message,setmessage] = useState('');
    console.log(myReservations);
    return(
        <Jumbotron>
                    <div className="container">
                        <div className="home">   
                            {/* <h1>Ristorante con Fusion</h1>
                            <p>We take inspiration from the World's best cuisines, and create a unique fusion experience. Our lipsmacking creations will tickle your culinary senses!</p> */}
                            <div className="homefont">
                                <span>Start Your Order Now.</span>
                            </div>
                            <div className="image">
                                <img src={home} alt="Ristorante con Fusion" />
                                <span>Ooh la lavender</span>
                                <Button tag={Link} to="/menu">order here</Button>
                            </div>
                        </div>
                        <div className="home"> 
                            <div className="image">
                                <img src={Homepage} alt="Ristorante con Fusion" />
                                <span>Protein-packed goodness</span>
                                <Button tag={Link} to="/menu">order here</Button>
                            </div>
                        </div>
                        
                        <div className="head-res">
                            <span>Upcoming Reservation</span>
                        </div>
                        <div className="reservations">
                        { myReservations.length != 0 ?
                            myReservations.map((item)=>(
                            <div className="upcoming-reseravtion">
                                <div className="first">
                                        <span>{new Date(item.res_date).toLocaleDateString('en-US', options)} </span>
                                        <span>Tables:  {item.tab_count}</span> 
                                        <span>Type:  {item.tabletype}</span>
                                        <span>Time:  {formatTime(item.timeslot)}</span>
                                </div>
                                <div className="second">
                                    <Button tag={Link} to="/reservations">Modify  Reservation</Button>
                                    <Button className="cancelres-btn"
                                        onClick={()=>handlecancelreservation(username,branchname,new Date(item.res_date).toISOString().split('T')[0],item.timeslot,item.tabletype,setMyReservations,setalert,setmessage)}>
                                        Cancel  Reservation
                                    </Button>
                                </div>
                                    {alert && <AlertBox message={message} />}
                                </div>
                        ))
                       
                            :
                            <div className="upcoming-reseravtion">
                            <div className="first">
                                <span>Uh oh ,you have no upcoming reservations..</span>
                                </div>
                                <div className="second">
                                <Button tag={Link} to="/reservations">Reserve a Table</Button>
                            </div>
                        </div>
                        }
                         </div>
                        
                    </div>
        </Jumbotron>
    )
    
    
}

export default Home;