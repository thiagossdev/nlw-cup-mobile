import { HStack, Text } from 'native-base';
import CountryFlag from 'react-native-country-flag';

import { Input } from './Input';

interface Props {
  code: string;
  position: 'left' | 'right';
  value?: number;
  onChangeText: (value: string) => void;
}

export function Team({ code, position, onChangeText, value }: Props) {
  return (
    <HStack alignItems="center">
      {position === 'left' && <CountryFlag isoCode={code} size={25} style={{ marginRight: 12 }} />}

      {!value ? (
        <Input w={12} h={9} textAlign="center" fontSize="xs" keyboardType="numeric" onChangeText={onChangeText} />
      ) : (
        <Text
          bg="gray.800"
          w={12}
          h={9}
          px={4}
          py={2}
          borderColor="gray.600"
          borderWidth={1}
          borderRadius={4}
          fontSize="xs"
          fontFamily="body"
          color="white"
          textAlign="center"
        >
          {value}
        </Text>
      )}

      {position === 'right' && <CountryFlag isoCode={code} size={25} style={{ marginLeft: 12 }} />}
    </HStack>
  );
}
