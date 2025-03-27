import { TextInputProps, TouchableOpacityProps } from "react-native";



declare interface InputFieldProps extends TextInputProps {
    label: string;
    icon?: any;
    secureTextEntry?: boolean;
    labelStyle?: StyleProp<TextStyle>;      // ✅ Corrigé
    containerStyle?: StyleProp<ViewStyle>;  // ✅ Corrigé
    inputStyle?: StyleProp<TextStyle>;      // ✅ Corrigé
    iconStyle?: StyleProp<ImageStyle>;      // ✅ Corrigé
    className?: string;
  }



  
declare interface ButtonProps extends TouchableOpacityProps {
    title: string;
    bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
    textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
    IconLeft?: React.ComponentType<any>;
    IconRight?: React.ComponentType<any>;
    className?: string;
  }
  