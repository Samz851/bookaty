import axios from 'axios';
import { IP2LocationURL, APIKEY} from '@iso/config/geolocation.config';
export const ipToLocation = async ( ip ) => {

    try{
        let request = await axios.get(IP2LocationURL, {params: {apiKey: APIKEY, ip: ip}});
        if(request.status == 200){
            return {
                status: request.status,
                city: request.data.city,
                state_prov: request.data.state_prov,
                country: request.data.country_name,
                lat: request.data.latitude,
                long: request.data.longitude
            };
        }
    
    }catch (error) {
        return {
            status: error.response.status,
            message: error.response.data.message
        };

    }
    
};