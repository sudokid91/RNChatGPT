/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useCallback, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {GiftedChat, IMessage} from 'react-native-gifted-chat';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';

const App = () => {
  const [messages, setMessages] = useState(Array<IMessage>);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((message: any[]) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, message),
    );
    const text = message[0]?.text;
    callApi(text);
  }, []);

  const callApi = async (text: string) => {
    const body = {
      model: 'text-davinci-003',
      prompt: text,
      max_tokens: 100,
      temperature: 0,
    };
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer ' + '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',
      },
    };
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/completions',
        JSON.stringify(body),
        config,
      );
      const data = response?.data;
      if (data) {
        const mesReply = data?.choices[0]?.text;
        addNewMessage(mesReply);
      }
    } catch (error) {}
  };

  const addNewMessage = (data: string) => {
    const mes = [
      {
        _id: Math.random(),
        text: data,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ];
    setMessages(previousMessages => GiftedChat.append(previousMessages, mes));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>Chat With GPT</Text>
      </View>
      <GiftedChat
        messages={messages}
        onSend={message => onSend(message)}
        user={{
          _id: 1,
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  header: {
    width: '100%',
    height: 100,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28,
    color: 'blue',
  },
});

export default App;
