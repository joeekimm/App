import React, { Component } from "react";
import { StyleSheet, AsyncStorage, Switch, Image } from "react-native";
import { View, Input, Item, Button, Text, Toast, Picker,Label,Content,Container,Form} from "native-base";
import { Actions } from "react-native-router-flux";
import axios from "axios";

export default class ManageDish extends Component {
  constructor() {
    super();
    this.state = {
      //  selectedItem: 'undefined',
        selected1: 0,
      showToast: false,
      userId: '',
      userName: '',
      userPic: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    // let userId, userName, userPic;
    // async function getProfile() {
    //   try {
    //     const data = await AsyncStorage.getItem('profile');
    //     if (data !== null && data !== undefined) {
    //       // console.log('async data: ', data);
    //       data = JSON.parse(data);
    //       userId = data.identityId, userName = data.name, userPic = data.extraInfo.picture_large;
    //     }
    //   } catch (err) {
    //     console.log('Error getting data: ', err);
    //   }
    // }

    // getProfile()
    //   .then(() => {
    //     this.setState({ userId: userId, userName: userName, userPic: userPic })
    //   })
    let dish = this.props.fetchDish()
    dish.cashDonation += ''
    dish.quantity += ''
    this.setState({dish},() => console.log(this.state.dish));
    this.setState({genres:['Select a Cuisine Style'].concat(this.props.getStyles())},() => {
      this.setState({selected1: this.state.genres.indexOf(dish.cuisineType)});
      
    })
  }

  handleSubmit() {
    let dish = this.state.dish;
    console.log('SEND: ', dish);

    axios.put("http://localhost:3000/dish", dish).then(Actions.chefPanel());
  }
  onValueChange (value) {
    console.log(this.state.genres[value])
    let dish = this.state.dish
    dish['cuisineType'] = this.state.genres[value]
    this.setState({
        selected1 : value, dish
    },() =>console.log(this.state.dish));
  }
  render() {
    return (
     <Container   style={{
          flex: 1,
          flexDirection: "column",


        }}>
        <Content >
          <Image source={{ uri:this.state.dish.dishImages[0]}}  
        style={{width: 200, height: 200}}
          resizeMode={Image.resizeMode.center} />
          <Form style={{ marginTop: 100 }}>
            <Text> {this.state.dish.isActive? 'Active' : "Inactive"}</Text>
            <Switch
              onValueChange={(value) => {
                let dish = this.state.dish;
                dish.isActive = value
                this.setState({dish}, () => console.log(this.state.dish.isActive))
                }}
              style={{marginBottom: 10}}
              value={this.state.dish.isActive} />
            <Item>
              <Input
                placeholder="Name"
                onChangeText={name => {
                   let dish = this.state.dish;
                  dish.name = name;
                  this.setState({dish},()=>console.log(this.state.dish));

                }}
                value={this.state.dish.name}
              />
            </Item>
            <Item>
              <Input
                placeholder="Description"
                onChangeText={description =>{
                  let dish = this.state.dish;
                  dish.description = description
                  this.setState({dish},()=>console.log(this.state.dish));
                }}
                value={this.state.dish.description}
              />
            </Item>
            <Item stackedLabel>
              <Label>$</Label>
              <Input 
                placeholder="Donation Amount"
                onChangeText={cashDonation => {
                    let dish = this.state.dish;
                    dish.cashDonation = cashDonation
                    this.setState({ dish},()=> console.log(this.state.dish))
                  }
                }
              
                value={this.state.dish.cashDonation}
              />
            </Item>
            <Item>
              <Input
                placeholder="Quantity"
                keyboardType={"number-pad"}
                onChangeText={quantity =>{
                    let dish = this.state.dish;
                    dish.quantity = quantity;
                    this.setState({ dish},()=> console.log(this.state.dish))
                  }}
                value={this.state.dish.quantity}
              />
            </Item>
             <Picker
                supportedOrientations={['portrait','landscape']}
                iosHeader="Select one"
                mode="dropdown"
                selectedValue={this.state.selected1}
                onValueChange={this.onValueChange.bind(this)}>
                {/*<Item label="Select a Cuisine Style" value={0} />*/}
                { this.state.genres ? this.state.genres.map((curr,ind) => {
                  return (
                    <Item label={curr} value={ind} />
                  );

                }): {}}
            </Picker>
            <Button style={{ marginTop: 70}} onPress={() => this.handleSubmit()}>
              <Text>Submit </Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});