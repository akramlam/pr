import React from 'react';
import { Box, Button, Card, Container, Typography, Stack, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { GameSession, GamePlayer } from '../types';

interface GameLobbyProps {
  session: GameSession | null;
  currentPlayer: GamePlayer | null;
  isConnected: boolean;
  onReady: (ready: boolean) => void;
  onStart: () => void;
}

export const GameLobby: React.FC<GameLobbyProps> = ({
  session,
  currentPlayer,
  isConnected,
  onReady,
  onStart,
}) => {
  const { t } = useTranslation();

  if (!isConnected) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Stack spacing={2} alignItems="center">
            <CircularProgress />
            <Typography>{t('connecting')}</Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  if (!session || !currentPlayer) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Typography color="error">{t('sessionError')}</Typography>
        </Box>
      </Container>
    );
  }

  const isEveryoneReady = session.players.every((player) => player.ready);
  const canStartGame = currentPlayer.isHost && isEveryoneReady && session.players.length >= 2;

  return (
    <Container maxWidth="sm">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t('gameLobby')}
        </Typography>
        
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
          {t('lobbyCode')}: <Box component="span" fontWeight="bold">{session.id}</Box>
        </Typography>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            {t('players')}
          </Typography>
          <Stack spacing={2}>
            {session.players.map((player) => (
              <Card key={player.id} sx={{ p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography>
                      {player.name || t('player')} {player.isHost && `(${t('host')})`}
                    </Typography>
                    {player.ready && (
                      <Typography color="success.main" variant="body2">
                        {t('ready')}
                      </Typography>
                    )}
                  </Box>
                  {player.id === currentPlayer.id && (
                    <Button
                      variant="contained"
                      color={player.ready ? "error" : "primary"}
                      onClick={() => onReady(!player.ready)}
                      size="small"
                    >
                      {player.ready ? t('notReady') : t('ready')}
                    </Button>
                  )}
                </Box>
              </Card>
            ))}
          </Stack>
        </Box>

        {currentPlayer.isHost && (
          <Box mt={4} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="success"
              size="large"
              disabled={!canStartGame}
              onClick={onStart}
            >
              {t('startGame')}
            </Button>
          </Box>
        )}

        {currentPlayer.isHost && !canStartGame && (
          <Typography variant="body2" color="text.secondary" align="center" mt={2}>
            {session.players.length < 2
              ? t('waitingForPlayers')
              : t('waitingForReady')}
          </Typography>
        )}
      </Box>
    </Container>
  );
}; 