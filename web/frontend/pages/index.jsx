import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
  IndexTable,
  useIndexResourceState,
  Button,
} from "@shopify/polaris";
import { useState, useEffect } from "react";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
import { useAuthenticatedFetch } from "../hooks";
import {Provider, ResourcePicker, useAppBridge} from '@shopify/app-bridge-react';
import createApp from "@shopify/app-bridge";
import { Cart, Pos } from "@shopify/app-bridge/actions";

// import { trophyImage } from "../assets";

// import { ProductsCard } from "../components";
// import { useAppQuery } from "../hooks";

// const config = {
//   apiKey: "b2c2a60b60c2f5458a1446412d7d52c5",
//   host: "https://pos-add-product.myshopify.com/admin",
//   forceRedirect: true,
// }

// const app = createApp(config)

export default function HomePage() {
  const [appSetup, setAppSetup] = useState();
  const [products, setProducts] = useState([]);
  const [cartItem, setCartItem] = useState([]);
  const appBridge = useAppBridge();
  const authFetch = useAuthenticatedFetch();

  const handleCartAdd = (p) => {
    setCartItem([...cartItem, p]);
  }

  console.log(cartItem);

  const fetchProducts = async () => {
    try {
      const response = await authFetch('/api/products/all');
      const jsonData = await response.json();
      setProducts(jsonData.data);
    } catch (err) {
      console.error('Error: ', err);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [products]);

  useEffect(() => {
    setAppSetup(appBridge)
  }, [])

  // console.log(appSetup)

  // const {selectedResources, allResourcesSelected, handleSelectionChange} =
  //   useIndexResourceState(products);

  const { t } = useTranslation();

  function delay(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  return (
    <div>
      <h1>Hello world</h1>
      <div>
        {products.map((product, i) => {
          return (
          <p 
          key={`product_${i}`}
            onClick={() => handleCartAdd(product)}
            style={{cursor: "pointer", padding: "5px"}}
          >
            {`id: ${product.id}, title: ${product.title}`}
          </p>
          )
        })}
      </div>

      <Button onClick={() => {
        let cart = Cart.create(appSetup)
        let pos = Pos.create(appSetup)
        cartItem.map(async (ci, i) => {
          cart.dispatch(Cart.Action.ADD_LINE_ITEM, {
            data: {
              variantId: ci.variants[0].id,
              quantity: 1
            }
          })
          await delay(2000);
        })
        pos.dispatch(Pos.Action.CLOSE)
      }}>add to cart</Button>

      {
        cartItem.map((c, i) => {
          return <p>{c.title}</p>
        })
      }

      <br />
      <br />
    </div>
  );
}
