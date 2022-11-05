import { useNavigation } from '@react-navigation/native';
import { Heading, useToast, VStack } from 'native-base';
import { useState } from 'react';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { api } from '../services/axios';

export function Find() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { navigate } = useNavigation();
  const toast = useToast();

  async function handlePoolCreate() {
    if (!code.trim()) {
      return toast.show({
        title: 'Informe o código do bolão!',
        placement: 'top',
        bgColor: 'red.500',
      });
    }

    try {
      setIsLoading(true);

      await api.post('/pools/join', {
        code: code.trim(),
      });

      toast.show({
        title: 'Você entrou no bolão com sucesso',
        placement: 'top',
        bgColor: 'grren.500',
      });

      navigate('pools');
    } catch (error) {
      console.log(error);
      setIsLoading(false);

      let message;
      if (error.response?.data?.message === 'Pool not found.') {
        message = 'Bolão não encontrado!';
      } else if (error.response?.data?.message === 'You already joined this pool.') {
        message = 'Você já está nesse bolão!';
      } else {
        message = '';
      }

      toast.show({
        title: message,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading fontFamily="heading" color="white" fontSize="lg" mb={8} textAlign="center">
          Encontre um bolão através de seu seu código único!
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          autoCapitalize="characters"
          onChangeText={setCode}
          value={code}
        />

        <Button title="Buscar bolão" isLoading={isLoading} onPress={handlePoolCreate} />
      </VStack>
    </VStack>
  );
}
