import { TextInput, View, Text, Image, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import { InputFieldProps } from "@/types/type";

const InputField = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  ...props
}: InputFieldProps) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.wrapper}>
        {/* Label */}
        <Text style={[styles.label, labelStyle]}>{label}</Text>

        {/* Input Container */}
        <View style={[styles.inputContainer, containerStyle]}>
          {icon && <Image source={icon} style={[styles.icon, iconStyle]} />}
          <TextInput
            style={[styles.input, inputStyle]}
            secureTextEntry={secureTextEntry}
            placeholder={props.placeholder}  // Placeholder passed from parent
            placeholderTextColor="#A9A9A9"  // Ensure placeholder is visible
            {...props}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InputField;

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
    width: "100%",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 12,
    height: 50,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 12,
  },
});
