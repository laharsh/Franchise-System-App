import {baseUrl} from "./baseUrl";

export const login = async(username, pswrd) => {
    try{
        const response = await fetch (baseUrl + 'login',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'username': username, 'pswrd': pswrd})
        });
        const data = await response.json();
        return data ;
    }
    catch(error){
        console.error('Error:', error);
        throw error;
    }
};

export const signup = async (username, pswrd, email, phone) => {
    try {
        const response = await fetch( baseUrl + 'signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'username': username, 'pswrd': pswrd, 'email': email, 'phone': phone })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const branches = async () => {
    try{
        const response = await fetch (baseUrl + 'branches',{
            method: 'GET',
            headers: {
                'Content-Type':'application/json'
            }, 
        });
        const data = await response.json();
        return data ;
    }
    catch(error){
        console.error('Error:', error);
        throw error;
    }
};

export const cartitems = async (username,branchname) => {
    try{
        const response = await fetch (baseUrl + 'cartitems',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'username': username, 'branchname': branchname})
        });
        console.log('cartitems call');
        console.log('username', username, 'branchname', branchname);
        const data = await response.json();
        console.log(data);
        return data ;
    }
    catch(error){
        console.error('Error:', error);
        throw error;
    }
};

export const menu = async (branchname) => {
    try{
        const response = await fetch (baseUrl + 'menu',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            }, 
            body: JSON.stringify({'branchname': branchname})
        });
        const data = await response.json();
        return data ;
    }
    catch(error){
        console.error('Error:', error);
        throw error;
    }
};

export const tabl = async (branchname) => {
    console.log(branchname);
    try{
        const response = await fetch (baseUrl + 'tabl',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            }, 
            body: JSON.stringify({'branchname': branchname})
        });
        const data = await response.json();
        return data ;
    }
    catch(error){
        console.error('Error:', error);
        throw error;
    }
};

export const reservations = async(username,branchname,res_date,timeslot,tabletype,tab_count) => {
    try{
        const response = await fetch(baseUrl + 'reservations', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'username':username,'branchname':branchname,'res_date':res_date,'timeslot':timeslot,'tabletype':tabletype,'tab_count':tab_count})
        });
        const data = await response.json();
        return data;
    }
    catch(error){
        console.error('Error:',error);
        throw error;
    }
};

export const cancelreservations = async(username,branchname,res_date,timeslot,tabletype) => {
    try{
        const response = await fetch(baseUrl + 'cancelreservations', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ 'username':username,'branchname':branchname,'res_date':res_date,'timeslot':timeslot,'tabletype':tabletype })
        });
        const data = await response.json();
        return data;
    }
    catch(error){
        console.error('Error:',error);
        throw error;
    }
};

export const getreservations = async (username,branchname) => {
    try{
        const response = await fetch (baseUrl + 'getreservations',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            }, 
            body: JSON.stringify({'username': username, 'branchname': branchname})
        });
        const data = await response.json();
        return data ;
    }
    catch(error){
        console.error('Error:', error);
        throw error;
    }
};

export const favourites = async(username,branchname,itemname) => {
    try{
        const response = await fetch(baseUrl + 'favourites', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'username':username,'branchname':branchname,'itemname':itemname})
        });
        const data = await response.json();
        return data;
    }
    catch(error){
        console.error('Error:',error);
        throw error;
    }
};

export const getfavourites = async (username,branchname) => {
    try{
        const response = await fetch (baseUrl + 'getfavourites',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            }, 
            body: JSON.stringify({'username':username,'branchname':branchname})
        });
        const data = await response.json();
        return data ;
    }
    catch(error){
        console.error('Error:', error);
        throw error;
    }
};

export const removefavourites = async (username,itemname) => {
    try{
        const response = await fetch (baseUrl + 'removefavourites',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            }, 
            body: JSON.stringify({'username':username,'itemname':itemname})
        });
        const data = await response.json();
        return data ;
    }
    catch(error){
        console.error('Error:', error);
        throw error;
    }
};


export const cart = async(username,branchname,itemname,itemcount) => {
    try{
        const response = await fetch(baseUrl + 'cart', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'username': username,'branchname':branchname,'itemname':itemname,'itemcount':itemcount})
        });
        const data = await response.json();
        return data;
    }
    catch(error){
        console.log('Error:',error);
        throw error;
    }
};


export const removecart = async (username, branchname, itemname) => {
    try{
        const response = await fetch (baseUrl + 'removecart',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            }, 
            body: JSON.stringify({'username':username,'branchname': branchname, 'itemname':itemname})
        });
        const data = await response.json();
        return data ;
        console.log(data);
    }
    catch(error){
        console.error('Error:', error);
        throw error;
    }
};
    
        
    

