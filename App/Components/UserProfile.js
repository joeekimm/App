import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  AsyncStorage,
  ScrollView
} from "react-native";
import {
  Container,
  Text,
  Content,
  Card,
  CardItem,
  Left,
  Body,
  Button,
  H3
} from "native-base";
import { Actions, ActionConst } from "react-native-router-flux";
import { Grid, Row, Col } from "react-native-easy-grid";
import DishView from "./DishView";
import Review from "./Review";
import axios from "axios";
import SetProfile from "../utils/SetProfile";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chefReviews: [],
      customerReviews: [],
      showChefReviews: false,
      showCustomerReviews: true
    };
    this.handleReviews = this.handleReviews.bind(this);
  }

  handleReviews() {
    var allReviews = this.state.chefReviews.concat(this.state.customerReviews);

    if (allReviews.length === 0) {
      return <Text>No reviews available at this time.</Text>;
    } else {
      return (
        <Content
          contentContainerStyle={{
            marginRight: 10,
            marginLeft: 10,
            marginTop: 10
          }}
        >
          <H3 style={{ color: "#505050" }}>Reviews</H3>
          {allReviews.map(review => {
            return <Review review={review} />;
          })}
        </Content>
      );
    }
  }

  componentWillMount() {
    let context = this;
    if (!this.props.profile) {
      async function grabAuthId() {
        try {
          const profile = await AsyncStorage.getItem("profile");
          if (profile !== null && profile !== undefined) {
            userId = JSON.parse(profile).userId;
            parsedProfile = JSON.parse(profile);
            var authId = parsedProfile.userId;
            var fullName = parsedProfile.name;

            axios
              .get(`http://homemadeapp.org:3000/user/${authId}`)
              .then(user => {
                context.setState({
                  fullName: user.data[0].firstName,
                  authId: authId,
                  userPic: user.data[0].profileUrl,
                  user: user.data[0],
                  chefReviews: user.data[0].chefReviews,
                  customerReviews: user.data[0].customerReviews,
                  status: user.data[0].status
                });
              })
              .catch(error => {
                console.log(
                  "Error inside axios get user for UserProfile.js is ",
                  error
                );
              });
          }
        } catch (err) {
          console.log("Error getting profile: ", err);
        }
      }
      grabAuthId();
    } else {
      axios
        .get(`http://homemadeapp.org:3000/user/${this.props.profile.authId}`)
        .then(user => {
          this.setState({
            fullName: user.data[0].firstName,
            authId: user.data[0].authId,
            userPic: user.data[0].profileUrl,
            user: user.data[0],
            chefReviews: user.data[0].chefReviews,
            customerReviews: user.data[0].customerReviews,
            status: user.data[0].status
          });
        })
        .catch(error => {
          console.log(
            "Error inside axios get user for UserProfile.js is ",
            error
          );
        });
    }
  }

  render() {
    const styles = {
      text: {
        color: "#505050",
        alignSelf: "center"
      }
    };

    return (
      <Content>
        <Card style={{ flex: 0.3, marginTop: -50, justifyContent: "center" }}>
          <CardItem>
            <Body>
              <Text style={styles.text}>
                {!this.state.fullName ? "name unknown" : this.state.fullName}
              </Text>
              <Text style={styles.text} note>
                {!this.state.status
                  ? "No status at this time."
                  : this.state.status}
              </Text>
            </Body>
          </CardItem>
          <CardItem>
            <Body>
              <Row style={{ justifyContent: "center", alignSelf: "center" }}>
                <Image
                  style={{
                    position: "absolute",
                    width: 120,
                    height: 120,
                    justifyContent: "center",
                    borderRadius: 60
                  }}
                  source={{
                    uri: !this.state.userPic ? "" : this.state.userPic
                  }}
                />
              </Row>
            </Body>
          </CardItem>
        </Card>

        {this.handleReviews()}

      </Content>
    );
  }
}

/*
gmail UserProfile



{"extraInfo":
  {"locale":"en","family_name":"Mendoza","gender":"male","email_verified":true,"given_name":"Jaime","updated_at":"2017-06-04T19:30:37.883Z","clientID":"Rp7ThYPPRNHrSGUaLOv_Ub307zwDb_VR","global_client_id":"Yr3FRkbN-xAd7_KvxSZ-6Fvz6OqRPXHM"},

  "userMetadata":{},
  "picture":"http://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg",
  "userId":"google-oauth2|111548799256401715601",
  "identities":[{"social":true,"provider":"google-oauth2","identityId":"google-oauth2|111548799256401715601","userId":"111548799256401715601","connection":"google-oauth2"}],
  "appMetadata":{},
  "nickname":"jaimemendozadev",
  "email":"jaimemendozadev@gmail.com",
  "name":"Jaime Mendoza",
  "createdAt":1495800977.404,
  "chefView":false,
  "isChef":false}



facebook profile

{"extraInfo":
  {"third_party_id":"-R4vav3zP0MHd52x_pp6UuVdwr0",
  "context":{"mutual_likes":{"summary":{"total_count":100},"data":[]},"id":"dXNlcl9jb250ZAXh0OgGQNl5YJU9UckwPGo2bIRs3LKZAPSxf2G2ln42xXj2JvGMycwlHm0WZAbIcRonlkYVq0ABZCHorWgUnyg5fZCehqnZAM6dcZCcr24qtBZBxgw1dQ5pYpIZD"},
  
  "link":"http://www.facebook.com/app_scoped_user_id/10209561963947713/",
  "name_format":"{first} {last}",
  "clientID":"Rp7ThYPPRNHrSGUaLOv_Ub307zwDb_VR",
  "updated_at":"2017-06-04T20:19:02.741Z",
  "global_client_id":"Yr3FRkbN-xAd7_KvxSZ-6Fvz6OqRPXHM",
  "family_name":"Susan",
  "is_verified":false,
  "devices":[{"hardware":"iPhone","os":"iOS"}],
  "installed":true,
  "locale":"en_US",
  "verified":true,
  "email_verified":true,
  "given_name":"David",
  "gender":"male",
  "timezone":-7,
  "age_range":{"min":21},
  "picture_large":"http://scontent.xx.fbcdn.net/v/t1.0-1/15380389_10208254679826427_3585448135424856175_n.jpg?oh=b3564cd79c481bb06a20f0905257927e&oe=59AEC34F",
  "updated_time":"2017-04-25T19:49:46+0000"},
  "picture":"http://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/15380389_10208254679826427_3585448135424856175_n.jpg?oh=253da281d806851d8599885520b03ab0&oe=59B31CD3",
  "userId":"facebook|10209561963947713",
  "identities":[{"social":true,"provider":"facebook","identityId":"facebook|10209561963947713","userId":"10209561963947713","connection":"facebook"}],
  "appMetadata":{},
  "nickname":"David Susan",
  "createdAt":1495740860.409,
  "name":"David Susan",
  "userMetadata":{},
  "isChef":true,
  "chefView":true}



regular email profile

{"extraInfo":
  {"email_verified":false,"updated_at":"2017-06-04T20:34:55.215Z","clientID":"Rp7ThYPPRNHrSGUaLOv_Ub307zwDb_VR","global_client_id":"Yr3FRkbN-xAd7_KvxSZ-6Fvz6OqRPXHM"},

   "userMetadata":{},
   "picture":"http://s.gravatar.com/avatar/245cf079454dc9a3374a7c076de247cc?s=480&r=pg&d=http%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png",
   "userId":"auth0|59346eee5f874258e3ffb4c5",
   "identities":[{"social":false,"provider":"auth0","identityId":"auth0|59346eee5f874258e3ffb4c5","userId":"59346eee5f874258e3ffb4c5","connection":"Username-Password-Authentication"}],
   "appMetadata":{},
   "nickname":"test1",
   "email":"test1@gmail.com",
   "name":"test1@gmail.com",
   "createdAt":1496608494.933,
   "chefView":false,"isChef":false}

*/
