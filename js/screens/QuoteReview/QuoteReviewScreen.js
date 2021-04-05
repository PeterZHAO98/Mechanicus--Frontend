import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, FlatList } from 'react-native';
import { NavGroup } from '../../common/BottomNav';
import { QuoteProgress } from '../../common/Progress';
import { VehicleCard } from '../../common/Card';
import { render } from 'react-dom';
import { styles } from './Styles';
import { TabRouter } from '@react-navigation/routers';
import { useQuery } from "urql";

const getSelectedServices = `
query($services: [Int!]! ) {
	selectedServices(services: $services ) {
        id
	    type
        price
	}
}
`;

const navOption = [
    {
        title: "Cancel", to: "QuoteService",
    },{
        title: "Schedule", to: "Schedule",
    }
];

const sampleServiceList = [
    {  
        id: "01",
        text: "Vehicle Inspection", 
        price: 123,
    },{  
        id: "02",
        text: "Oil change", 
        price: 123.
    },{  
        id: "03",
        text: "Brake repair", 
        price: 123
    }
];

function ServiceEntry({
    text = "service diaplay name",
    price = 123.0
}){
    return (
        <View style={styles.row} >
            <Text>{text}</Text>
            <Text>$ {price}</Text>
        </View>
    );
}
/* <QuoteReviewScreen> */
export default function QuoteReviewScreen({ route, navigation }) {

    //get service options from database
    //==========
    const [result, reexecuteQuery] = useQuery({
        query: getSelectedServices,
        variables: {
            services: route.params.services,
        }
    });
    const { data, fetching, error } = result;
    if (error) {
        Alert.alert("Error!",result.error.message,[
            { text: "OK", style: "OK" },
        ]);
    }
    // if (data) {
    //     console.log(data.services);
    // }
    //===========

    const { vehicle, services } = route.params;
    const renderItem = ({item}) => {
        return (
            <ServiceEntry text={item.type} price={item.price} />
        );
    };
    
    //get total price of services
    const getTotalPrice = () => {
        let sum = 0;
        if(data){
            let list = data.selectedServices;
            list.forEach(item=>{
                sum += item.price;
            });
        }
        return sum;
    };

    // console.log("####review");
    // console.log(route.params);
    
    return (
        <View style={styles.container}> 
            <View>
                <QuoteProgress curStep={3} status={[true,true,false]} />
                <View>
                    <Text>Vehicle</Text>
                    <VehicleCard item={vehicle} />
                </View>
                <View>
                    <Text>Service</Text>
                    <FlatList 
                        data={data?data.selectedServices:[]}
                        renderItem={renderItem}
                        keyExtractor={item => String(item.id)}
                    />
                    <View>
                        <Text>Total price:{getTotalPrice()}</Text>
                    </View>
                </View>

            </View>
            <NavGroup navigation={navigation} options={navOption} data={{
                ...route.params,
            }}/>
        </View>
    );
} 