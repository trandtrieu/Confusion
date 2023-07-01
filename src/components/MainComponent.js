import React, { Component } from "react";
import Menu from "./MenuComponent";
import DishDetail from "./DishdetailComponent";
import { DISHES } from "../shared/dishes";
import Header from "./HeaderComponent";
import Footer from "./FooterComponent";
import Home from "./HomeComponent";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import Contact from "./ContactComponent";

import { connect } from "react-redux";
import { addComment, fetchDishes } from "../redux/ActionCreators";

class Main extends Component {
  componentDidMount() {
    this.props.fetchDishes();
  }

  constructor(props) {
    super(props);
  }

  render() {
    const HomePage = () => {
      return (
        <Home
          dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
          dishesLoading={this.props.dishes.isLoading}
          dishesErrMess={this.props.dishes.errMess}
          promotion={this.props.promotions.filter((promo) => promo.featured)[0]}
          leader={this.props.leaders.filter((leader) => leader.featured)[0]}
        />
      );
    };

    const DishWithId = () => {
      const { dishId } = useParams();
      return (
        <DishDetail
          dish={
            this.props.dishes.dishes.filter(
              (dish) => dish.id === parseInt(dishId, 10)
            )[0]
          }
          isLoading={this.props.dishes.isLoading}
          errMess={this.props.dishes.errMess}
          comments={this.props.comments.filter(
            (comment) => comment.dishId === parseInt(dishId, 10)
          )}
          addComment={this.props.addComment}
        />
      );
    };

    return (
      <div>
        <Header />
        <Routes>
          <Route path="/home" Component={HomePage} />
          <Route
            exact
            path="/menu"
            element={
              <Menu
                dishes={this.props.dishes}
                onClick={(dishId) => this.onDishSelect(dishId)}
              />
            }
          />
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/contactus" Component={Contact} />
          <Route path="/menu/:dishId" Component={DishWithId} />
        </Routes>
        <Footer />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  addComment: (dishId, rating, author, comment) =>
    dispatch(addComment(dishId, rating, author, comment)),
  fetchDishes: () => {
    dispatch(fetchDishes());
  },
});

const mapStateToProps = (state) => ({
  dishes: state.dishes,
  comments: state.comments,
  promotions: state.promotions,
  leaders: state.leaders,
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
