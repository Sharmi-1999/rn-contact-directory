import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

interface NicknameManagerProps {
  nickname?: string;
  onSave: (nickname: string) => void;
}

export const NicknameManager: React.FC<NicknameManagerProps> = ({ nickname = "", onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempNickname, setTempNickname] = useState(nickname);

  useEffect(() => {
    setTempNickname(nickname);
  }, [nickname]);

  const handleSave = () => {
    onSave(tempNickname);
    setIsEditing(false);
  };

  const handleRemove = () => {
    onSave("");
    setTempNickname("");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Manage Nickname</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Gym Buddy"
          value={tempNickname}
          onChangeText={setTempNickname}
          autoFocus
          maxLength={30}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              setTempNickname(nickname);
              setIsEditing(false);
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {nickname ? (
        <View style={styles.displayRow}>
          <View>
            <Text style={styles.label}>Nickname</Text>
            <Text style={styles.value}>{nickname}</Text>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={() => setIsEditing(true)}>
          <Text style={styles.addButtonText}>+ Add Nickname</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 40,
    fontSize: 16,
    color: "#333333",
    marginBottom: 12,
    backgroundColor: "#F9F9F9",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  cancelButton: {
    backgroundColor: "#E5E5EA",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  cancelButtonText: {
    color: "#333333",
  },
  displayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: "#8E8E93",
    textTransform: "uppercase",
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#E5E5EA",
    borderRadius: 6,
    marginRight: 8,
  },
  editButtonText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  removeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#FFE5E5",
    borderRadius: 6,
  },
  removeButtonText: {
    color: "#FF3B30",
    fontWeight: "600",
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  addButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default NicknameManager;
