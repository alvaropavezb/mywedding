import { Button, StyleSheet, TextInput } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";

import { supabase } from "@/services/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function TabOneScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [userText, setUserText] = useState<string>("");
  const [passwordText, setPasswordText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userText,
      password: passwordText,
    });

    console.log(data);

    if (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: userText,
      password: passwordText,
    });

    console.log(data);

    if (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      {!session ? (
        <View>
          <TextInput
            placeholder="Email"
            value={userText}
            onChangeText={setUserText}
          />
          <TextInput
            placeholder="Password"
            value={passwordText}
            onChangeText={setPasswordText}
          />
          <Button title="Sign Up" onPress={handleLogin} />
        </View>
      ) : (
        <Text>Logged in!</Text>
      )}

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
