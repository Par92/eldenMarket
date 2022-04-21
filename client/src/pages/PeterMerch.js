import { searchEldenRing } from "../utils/API";
import {
  Jumbotron,
  Container,
  Col,
  Form,
  Button,
  Card,
  CardColumns,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { saveItemsIds, getItemIds } from "../utils/localStorage";
import { useMutation } from "@apollo/client";
// import { ADD_TO_CART } from "../utils/mutations";
import Auth from "../utils/auth";
import Navbar from "../components/Navbar";

const PeterMerch = () => {
  const [searchedItems, setSearchedItems] = useState([]);
  const [price, setPrice] = useState(0);
  const [savedItemIds, setSavedItemIds] = useState(getItemIds());
  // const [saveItem, { error, data }] = useMutation(ADD_TO_CART);
  function runePrice(min, max) {
    setPrice(console.log(Math.floor(Math.random() * (max - min) + min)));
  }

  useEffect(() => {
    return () => saveItemsIds(savedItemIds);
  });

  const apiCall = async () => {
    try {
      const response = await searchEldenRing("creatures");

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { data } = await response.json();

      const creatureData = data.map((creature) => ({
        id: creature.id,
        drops: creature.drops || ["Nothing to drop"],
        title: creature.name,
        description: creature.description,
        image: creature.image,
      }));

      setSearchedItems(creatureData);
    } catch (err) {
      console.error(err);
    }
  };

  // const handleSaveItem = async (id) => {
  //   const itemToSave = searchedItems.find((item) => item.id === id);

  //   // get token
  //   const token = Auth.loggedIn() ? Auth.getToken() : null;

  //   if (!token) {
  //     return false;
  //   }

  //   try {
  //     const { data } = await saveItem({
  //       variables: { cart: { ...itemToSave } },
  //     });
  //     setSavedItemIds([...savedItemIds, itemToSave.id]);
  //     console.log(data);
  //   } catch (err) {
  //     console.error(JSON.stringify(err));
  //   }
  // };

  apiCall();
  return (
    <>
      <Navbar />
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Creatures</h1>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedItems.length
            ? `Viewing ${searchedItems.length} results:`
            : "Something went wrong"}
        </h2>
        <CardColumns>
          {searchedItems.map((item) => {
            return (
              <Card key={item.id} border="dark">
                {item.image ? (
                  <Card.Img
                    src={item.image}
                    alt={`The cover for ${item.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Card.Text>Drops: {item.drops}</Card.Text>
                  {price !== 0 ? `Price: ${price}` : null}
                  <Button
                    className="btn-block btn-info"
                    onClick={() => runePrice(1000, 10000)}
                  >
                    See Price
                  </Button>
                  {/* {Auth.loggedIn() && (
                    <Button
                      disabled={savedItemIds?.some(
                        (savedItemId) => savedItemId === item.id
                      )}
                      className="btn-block btn-info"
                      onClick={() => handleSaveItem(item.id)}
                    >
                      {savedItemIds?.some(
                        (savedItemId) => savedItemId === item.id
                      )
                        ? "This creature has already been saved!"
                        : "Save this Creature!"}
                    </Button>
                  )} */}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default PeterMerch;
