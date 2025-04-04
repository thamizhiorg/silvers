import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Header from '../components/Header';
import Button from '../components/Button';
import { useAppContext } from '../context/AppContext';

export default function CartScreen() {
  const router = useRouter();
  const { cart, removeFromCart, updateCartItemQuantity, clearCart } = useAppContext();

  const removeItem = (productId: string) => {
    removeFromCart(productId);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItemQuantity(productId, newQuantity);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const checkout = () => {
    Alert.alert('Success', 'Your order has been placed!');
    clearCart();
  };

  const renderCartItem = ({ item }) => {
    // Handle both URI and require() image sources
    const imageSource = typeof item.product.image === 'object' && item.product.image.uri
      ? { uri: item.product.image.uri }
      : item.product.image;

    return (
      <View style={styles.cartItem}>
        <Image source={imageSource} style={styles.productImage} />

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.product.name}</Text>
          {item.size && <Text style={styles.productSize}>Size: {item.size}</Text>}
          {item.product.category && <Text style={styles.productOption}>Category: {item.product.category}</Text>}
          {item.product.materials && <Text style={styles.productOption}>Material: {item.product.materials}</Text>}
          {item.product.designs && item.product.designs.length > 0 && (
            <Text style={styles.productOption}>Design: {item.product.designs[0].name}</Text>
          )}

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
            >
              <Ionicons name="remove" size={16} color={Colors.text} />
            </TouchableOpacity>

            <Text style={styles.quantity}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
            >
              <Ionicons name="add" size={16} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeItem(item.product.id)}
        >
          <Ionicons name="close" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="My Cart" showBackButton />

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color={Colors.lightGray} />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Button
            title="CONTINUE SHOPPING"
            onPress={() => router.push('/')}
            style={styles.continueButton}
          />
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={item => item.product.id}
            contentContainerStyle={styles.cartList}
          />

          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Items:</Text>
              <Text style={styles.totalAmount}>{getTotalItems()} items</Text>
            </View>

            <Button
              title="CHECKOUT"
              onPress={checkout}
              style={styles.checkoutButton}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  cartList: {
    padding: 15,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: Colors.text,
  },
  productSize: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 4,
  },
  productOption: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 12,
  },
  removeButton: {
    padding: 5,
  },
  footer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    color: Colors.darkGray,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  checkoutButton: {
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.darkGray,
    marginTop: 20,
    marginBottom: 30,
  },
  continueButton: {
    width: '80%',
  },
});
