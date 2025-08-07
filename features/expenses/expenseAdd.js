import { useNavigation } from "@react-navigation/native";
import { Pressable, Platform, View, Text, Button, TextInput } from "react-native";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/FontAwesome";
import ExpenseChangeForm from "./components/expenseChangeForm";

export default function ExpenseAdd(props = {}) {
  return <ExpenseChangeForm {...props} />;
}