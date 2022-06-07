import React, { Component } from 'react';
import { Text, View,Alert,StyleSheet,ImageBackground ,FlatList} from 'react-native';
import  axios from "axios"
export default class MeteorScreen extends Component {

constructor(){
    super()
    this.state={
        meteorInfo : {},
    }
}




getMeteorInfo = () =>{
    axios
    .get("https://api.nasa.gov/neo/rest/v1/feed?api_key=MiR6uPP70UzYwAk5buGOpHZcl5FjUZc2XoqTKXsI")
    .then(response =>{this.setState({meteorInfo:response.data.near_earth_objects})})
    .catch(error =>{Alert.alert(error.message)})
}
renderItems = ({items}) => {
    let meteors = items
    var bgImg,speed,size
    if(meteors.threat_score <=30){
        bgImg = require("../assets/meteor_bg1.png")
        speed = require("../assets/meteor_speed3.gif")
        size = 100
    }    
    else if (meteors.threat_score <= 75){
        bgImg = require("../assets/meteor_bg2.png")
        speed = require("../assets/meteor_speed3.gif")
        size = 150
    }
    else{
        bgImg = require("../assets/meteor_bg3.png")
        speed = require("../assets/meteor_speed3.gif")
        size = 200 
    }
    return (
        <View>
            <ImageBackground style={styles.backgroundImage} source={bgImg}>
                <View>
                    <Image source={speed} style= {{width:size,height:size,alignSelf:"center"}}/>
                    <View>
                        <Text> {items.name} </Text>
                        <Text> Closest to Eath {items.close_approach_data[0].close_approach_date_full} </Text>
<Text>Minmun diameter(km) {items.estimated_diameter.kilometers.estimated_diameter_min} </Text>
<Text>Maximum diameter(km) {items.estimated_diameter.kilometers.estimated_diameter_max}</Text>
<Text>Velocity(KMPH) {items.close_approach_data[0].relative_velocity.kilometers_per_hour} </Text>
<Text>Missed Earth By (KM) {items.close_approach_data[0].miss_distance.kilometers} </Text>
                    </View>
                </View>
            </ImageBackground>
        </View>
    )

}
keyExtractor = (item,index)=>{
    index.toString()
}
componentDidMount(){
  this.getMeteorInfo()
}

    render() {
        if(Object.keys(this.state.meteorInfo).length === 0){
            return(
                <View>
                    <Text>Loading......</Text>
                </View>
            )
        }
        else{
            let meteor_arr = Object.keys(this.state.meteorInfo).map(meteorDate=>{
               return this.state.meteorInfo[meteorDate]
            })
            let meteors = [].concat.apply([],meteor_arr)
            meteors.forEach(function(element){
                let diameter = (element.estimated_diameter.kilometers.estimated_diameter_min + element.estimated_diameter.kilometers.estimated_diameter_max)/2
                let threatScore = (diameter/element.close_approach_data[0].miss_distance.kilometers)*1000000000
                element.threat_score = threatScore
})
meteors.sort(function(a,b){return b.threat_score - a.threat_score})
meteors = meteors.slice(0,5)
        return (
           <View>
               <FlatList
               data={meteors}
               renderItem={this.renderItems}
               keyExtractor = {this.keyExtractor}
               horizontal={true}
               />
           </View>
          
        )
    }
}
}

const styles = StyleSheet.create ({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
})