import React, { Component } from "react";
import { StyleSheet, View, Image, AsyncStorage } from "react-native";
import {
  Container,
  Text,
  Content,
  Card,
  CardItem,
  Left,
  Body,
  Button,
  ListItem,
  Footer,
  FooterTab,
} from "native-base";
import { Actions, ActionConst } from "react-native-router-flux";
import { Grid, Row, Col } from "react-native-easy-grid";
import DishViewCard from "./DishViewCard";
import Review from "./Review";
import Icon from "react-native-vector-icons/Entypo";

import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.displayCheckout = this.displayCheckout.bind(this);
    this.handleReviewsPress = this.handleReviewsPress.bind(this);
    this.handleMenuPress = this.handleMenuPress.bind(this);

    this.toggleReviews = this.toggleReviews.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleMap = this.toggleMap.bind(this);

    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleCheckout = this.handleCheckout.bind(this);
    this.returnStar = this.returnStar.bind(this);
  }

  componentWillMount() {
    let chef;
    if (this.props.chef) {
      chef = [
        this.props.chef,
        this.props.chef.customerReviews,
        this.props.chef.customerReviews
      ];
    } else {
      chef = this.props.getChef();
    }

    let chefLocation = chef[0].location;

    this.setState({ chef: chef, cart: [], chefLocation }, () => {
      let scoresArray = [];
      let numOfReviews = this.state.chef[0].chefReviews.length;

      let reviews = this.state.chef[0].chefReviews.map(curr => {
        scoresArray.push(curr.score);
        return {
          userText: curr.reviewText,
          user: this.state.chef[2][
            this.state.chef[2]
              .map(o => {
                return o.authId;
              })
              .indexOf(curr.reviewerId)
          ],
          score: curr.score
        };
      });

      let avgScore = 0;
      if (scoresArray.length > 0) {
        avgScore = scoresArray.reduce((a, b) => a + b);
        avgScore = (avgScore / numOfReviews).toPrecision(2);
      }
      this.setState({ reviewers: reviews, avgScore });
    });
  }

  displayCheckout() {
    if (this.state.cart.length > 0) {
      return (
        <Button success onPress={() => this.handleCheckout()}>
          <Text> Checkout </Text>
        </Button>
      );
    } else {
      return <Text />;
    }
  }

  handleReviewsPress() {
    this.setState({ reviews: true, menu: false });
  }

  handleMenuPress() {
    this.setState({ reviews: false, menu: true });
  }

  toggleReviews() {
    if (this.state.reviewers.length > 0) {
      return this.state.reviewers.map(review => {
        return <Review review={review} />;
      });
    } else {
      return <Text note> Sorry no reviews available at this time </Text>;
    }
  }

  toggleMenu() {
    if (this.state.menu) {
      return this.state.chef[1].map((dish, idx) => {
        if (dish.quantity > 0) {
          if (idx === this.state.chef[1].length - 1) {
            return (
              <DishViewCard dish={dish} addToCart={this.handleAddToCart} />
            );
          } else {
            return (
              <DishViewCard dish={dish} addToCart={this.handleAddToCart} />
            );
          }
        }
      });
    } else {
      return <Text />;
    }
  }

  toggleMap() {
    var region = {
      latitude: this.state.chefLocation.geo_lat,
      longitude: this.state.chefLocation.geo_lng,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LATITUDE_DELTA * ASPECT_RATIO
    };

    Actions.chefMap({ singleChef: region });
  }

  handleAddToCart(e) {
    var cart = [];
    cart = this.state.cart;
    cart.push(e);
    this.setState({ cart: cart });
  }

  handleCheckout() {
    let customerId;
    async function checkStorage() {
      try {
        const data = await AsyncStorage.getItem("profile");
        if (data !== null && data !== undefined) {
          customerId = JSON.parse(data).userId;
        }
      } catch (err) {
        console.log("Error getting data: ", err);
      }
    }
    checkStorage().then(() => {
      this.setState(
        {
          checkout: {
            data: this.state.cart,
            chefId: this.state.chef[0].authId,
            customerId: customerId
          }
        },
        () => {
          this.props.setCart(this.state.checkout);
          Actions.checkout({ type: ActionConst.RESET });
        }
      );
    });
  }

  returnRow(dish) {
    return <Text> {dish.name} </Text>;
  }

  returnStar() {
    return <Icon style={{ color: "#EFEF54", fontSize: 18 }} name="star" />;
  }

  render() {
    let dishes = [];

    const styles = {
      container: {
        marginTop: 60
      },text: {
        color: "#505050",
        alignSelf: "center"
      },
      cardName: {
        alignSelf: "center",
        fontSize: 18,
        color: "#505050",
        fontFamily: "Noteworthy-Bold"
      },
      cardDesc: {
        alignSelf: "center",
        fontSize: 14,
        fontFamily: "Noteworthy-light"
      },
      cardRating: {
        alignSelf: "center",
        fontSize: 14,
        fontFamily: "Noteworthy-light"
      },
      cardRow: {
        justifyContent: "center",
        alignSelf: "center"
      },
      cardImage: {
        width: 120,
        height: 120,
        justifyContent: "center",
        borderRadius: 60
      }
    };

    return (
      <Container>
      <Container style={styles.container}>
        <Content>
          <Card>
            <CardItem>
              <Body style={{ justifyContent: "center", alignItems: "center" }}>
                  <Text style={styles.cardName}>
                    {this.state.chef[0].firstName} {this.state.chef[0].lastName}
                  </Text>
                <Text style={styles.cardDesc} note>
                  {this.state.chef[0].status}
                </Text>
                {this.state.avgScore > 0
                  ? <Text style={styles.cardRating} note>
                      {this.returnStar()} {this.state.avgScore}
                    </Text>
                  : <Text note>No Reviews Available</Text>}
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Row style={styles.cardRow}>
                  <Image
                    style={styles.cardImage}
                    source={{
                      uri: this.state.chef[0].profileUrl
                    }}
                  />
                </Row>
              </Body>
            </CardItem>
          </Card>

          <Row
            style={{
              marginTop: 10,
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "center"
            }}
          >
            {this.displayCheckout()}
          </Row>

          <Row
            style={{
              marginTop: 10,
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "center"
            }}
          >

            <Button
              style={{ marginRight: 10 }}
              onPress={this.handleReviewsPress}
            >
              <Text>Reviews</Text>
            </Button>

            <Button style={{ marginRight: 10 }} onPress={this.toggleMap}>
              <Text>Chef Location</Text>
            </Button>

            <Button style={{ marginRight: 10 }} onPress={this.handleMenuPress}>
              <Text>Menu</Text>
            </Button>
          </Row>
          
                      
          {this.state.reviews ? this.toggleReviews() : <Text />}
          {this.state.menu ? this.toggleMenu() : <Text />}

        </Content>
        
      </Container>
     
      </Container>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    top: 100,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
