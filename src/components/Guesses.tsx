import { FlatList, useToast } from 'native-base';
import { useEffect, useState } from 'react';

import { api } from '../services/axios';
import { EmptyMyPoolList } from './EmptyMyPoolList';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState<String[]>([]);
  const [secondTeamPoints, setSecondTeamPoints] = useState<String[]>([]);
  const toast = useToast();

  async function fetchGames() {
    try {
      setIsLoading(true);
      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games);
    } catch (error) {
      console.log(error);

      toast.show({
        title: 'Não foi possível carregar os jogos',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if (!firstTeamPoints[gameId]?.trim() || !secondTeamPoints[gameId]?.trim()) {
        return toast.show({
          title: 'Informe o placar para o palpite!',
          placement: 'top',
          bgColor: 'red.500',
        });
      }

      setIsLoading(true);

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints[gameId]),
        secondTeamPoints: Number(secondTeamPoints[gameId]),
      });

      toast.show({
        title: 'Palpite confirmado com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      });

      fetchGames();
    } catch (error) {
      console.log(error);

      toast.show({
        title: 'Não foi possível criar o bolão',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGames();
  }, [poolId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={(v) => {
            firstTeamPoints[item.id] = v;
            setFirstTeamPoints(firstTeamPoints);
          }}
          setSecondTeamPoints={(v) => {
            secondTeamPoints[item.id] = v;
            setSecondTeamPoints(secondTeamPoints);
          }}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    />
  );
}
