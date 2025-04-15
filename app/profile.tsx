import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../constants/Colors';
import Header from '../components/Header';
import Button from '../components/Button';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { favorites, cart } = useAppContext();
  const { user: authUser } = useAuth();

  // User data - use authenticated user email if available
  const user = {
    name: 'SKJ SILVERS',
    email: authUser?.email || 'skjsilvers@gmail.com',
    phone: '+91 9876543210',
    id: authUser?.id || 'Not signed in',
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'My Account',
      description: 'View and edit your personal information'
    },
    {
      icon: 'location-outline',
      title: 'My Addresses',
      description: 'Manage your delivery addresses'
    },
    {
      icon: 'cart-outline',
      title: 'Order History',
      description: 'View your past orders'
    },
    {
      icon: 'heart-outline',
      title: 'My Wishlist',
      description: `${favorites.length} items in your wishlist`
    },
    {
      icon: 'settings-outline',
      title: 'Settings',
      description: 'App preferences and notifications'
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      description: 'Contact us, FAQs, and more'
    },
    {
      icon: 'log-out-outline',
      title: 'Sign Out',
      description: 'Sign out from your account',
      onPress: () => router.push('/sign-out')
    },
  ];

  return (
    <View style={styles.container}>
      <Header title="Profile" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Ionicons name="person" size={40} color={Colors.lightGray} />
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>
            <Text style={styles.userId}>ID: {user.id}</Text>
          </View>

          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{cart.length}</Text>
            <Text style={styles.statLabel}>In Cart</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, item.title === 'Sign Out' && styles.signOutMenuItem]}
              onPress={item.onPress}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={item.title === 'Sign Out' ? '#FF3B30' : Colors.primary}
                />
              </View>
              <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, item.title === 'Sign Out' && styles.signOutText]}>
                  {item.title}
                </Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.darkGray} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.white,
    marginBottom: 10,
  },
  profileImageContainer: {
    marginRight: 15,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 2,
  },
  userId: {
    fontSize: 12,
    color: Colors.darkGray,
    fontStyle: 'italic',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 15,
    marginBottom: 10,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: Colors.lightGray,
  },
  menuContainer: {
    backgroundColor: Colors.white,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 12,
    color: Colors.darkGray,
  },

  signOutMenuItem: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    marginTop: 10,
    paddingTop: 15,
  },
  signOutText: {
    color: '#FF3B30',
  },
});
