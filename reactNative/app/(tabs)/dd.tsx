import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useFocusEffect, useNavigationState } from "@react-navigation/native";
import { Feather, Entypo, MaterialIcons,AntDesign } from "@expo/vector-icons";
import { images } from "@/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface MessagePreview {
  prestataireID: number;
  nom: string;
  prenom: string;
  photo: string;
  lastMessage: string;
  timestamp: string;
}

export default function MessageClient() {
  const [conversations, setConversations] = useState<MessagePreview[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const tabIndex = useNavigationState((state) => state.index);

  useFocusEffect(
    useCallback(() => {
      const fetchConversations = async () => {
        try {
          const client_id = await AsyncStorage.getItem("client_id");
          if (!client_id) return;

          setLoading(true);
          const res = await axios.get(
            `http://192.168.1.5:8000/messages/conversations/client/${client_id}`
          );
          setConversations(res.data);
        } catch (err) {
          console.error("Erreur chargement messages:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchConversations();
    }, [tabIndex])
  );

  const renderItem = ({ item }: { item: MessagePreview }) => {
    const scale = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(scale, {
        toValue: 0.96,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }).start(() => {
        router.push({
          pathname: "../pages/ChatScreen",
          params: {
            receiver_id: item.prestataireID,
            receiver_name: `${item.nom} ${item.prenom}`,
            receiver_photo: item.photo,
          },
        });
      });
    };

    return (
      <Animated.View style={[styles.chatCard, { transform: [{ scale }] }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.touchableRow}
        >
          <Image
            source={{ uri: `http://192.168.1.5:8000/${item.photo}` }}
            style={styles.avatar}
          />
          <View style={styles.chatContent}>
            <View style={styles.chatTop}>
              <Text style={styles.name} numberOfLines={1}>
                {item.nom} {item.prenom}
              </Text>
              <Text style={styles.time}>
                {new Date(item.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
            <View style={styles.chatBottom}>
              <MaterialIcons
                name="done-all"
                size={18}
                color="#7B2CBF"
                style={styles.checkIcon}
              />
              <Text style={styles.message} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ImageBackground source={images.fondecran4} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <AntDesign name="message1" size={26} color="#7B2CBF" />
          <Text style={styles.headerTitle}>Discussions</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity>
              <Feather name="search" size={20} color="#1C1C1E" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Entypo name="dots-three-vertical" size={18} color="#1C1C1E" />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#7B2CBF" />
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text style={styles.placeholder}>Aucune conversation.</Text>
            }
          />
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1C1C1E",
    marginLeft:-105,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16,
  },

  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 50,
  },

  placeholder: {
    fontSize: 15,
    color: "#999",
    textAlign: "center",
    marginTop: 40,
  },

  chatCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  touchableRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 14,
    borderColor: "#E6D8FA",
    borderWidth: 1,
    backgroundColor: "#f5f1ff",
  },
  chatContent: {
    flex: 1,
    justifyContent: "center",
  },
  chatTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
    flex: 1,
    marginRight: 12,
  },
  time: {
    fontSize: 12.5,
    color: "#999",
  },
  chatBottom: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 1,
  },
  message: {
    fontSize: 14,
    color: "#5A5A5A",
    flex: 1,
  },
  checkIcon: {
    marginRight: 6,
  },
});
