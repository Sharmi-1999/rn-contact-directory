import React, { useMemo, useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

interface AvatarProps {
  name: string;
  uri?: string;
  size?: number;
}

const COLORS = [
  "#E57373", "#F06292", "#BA68C8", "#9575CD", "#7986CB",
  "#64B5F6", "#4FC3F7", "#4DD0E1", "#4DB6AC", "#81C784",
  "#AED581", "#D4E157", "#FFD54F", "#FFB74D", "#FF8A65"
];

export const Avatar: React.FC<AvatarProps> = ({ name, uri, size = 50 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [uri]);

  const char = useMemo(() => {
    return name.trim().charAt(0).toUpperCase() || "?";
  }, [name]);

  const backgroundColor = useMemo(() => {
    let hash = 0;
    const cleanName = name.trim();
    for (let i = 0; i < cleanName.length; i++) {
      hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % COLORS.length;
    return COLORS[index];
  }, [name]);

  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor,
      overflow: "hidden",
      position: "relative",
    },
    image: {
      width: size,
      height: size,
      position: "absolute",
      top: 0,
      left: 0,
    },
    text: {
      color: "#FFFFFF",
      fontSize: size * 0.45,
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.container}>
      {!imageLoaded && <Text style={styles.text}>{char}</Text>}
      {uri && (
        <Image
          source={{ uri }}
          style={styles.image}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(false)}
        />
      )}
    </View>
  );
};
export default Avatar;
