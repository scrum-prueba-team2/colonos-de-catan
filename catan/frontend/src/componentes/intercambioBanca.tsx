import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { RECURSOS, type Recurso, type Recursos } from '../common/jugador';

interface Props {
  abierto: boolean;
  puedeIntercambiar: boolean;
  enviando: boolean;
  recursosJugador: Recursos;
  recursosBanca: Recursos;
  onAbrir: () => void;
  onCerrar: () => void;
  onConfirmar: (entregado: Recurso, recibido: Recurso) => void;
}

function IntercambioBanca({
  abierto, puedeIntercambiar, enviando, recursosJugador, recursosBanca,
  onAbrir, onCerrar, onConfirmar,
}: Props) {
  const [entregado, setEntregado] = useState<Recurso | ''>('');
  const [recibido, setRecibido] = useState<Recurso | ''>('');

  function abrir() {
    setEntregado('');
    setRecibido('');
    onAbrir();
  }

  const puedeConfirmar = puedeIntercambiar && !enviando
    && entregado !== '' && recibido !== '' && entregado !== recibido;

  return (
    <>
      <Button type="button" variant="outlined" size="small" fullWidth
        disabled={!puedeIntercambiar} onClick={abrir}>
        Intercambiar con la banca
      </Button>
      <Dialog open={abierto} onClose={enviando ? undefined : onCerrar} fullWidth maxWidth="xs">
        <DialogTitle>Intercambio con la banca</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Elige qué recurso entregas y cuál recibes. La banca calcula si necesitas
            2, 3 o 4 según tus puertos.
          </DialogContentText>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <FormControl fullWidth disabled={enviando}>
              <InputLabel id="recurso-entregado-label">Entregas</InputLabel>
              <Select labelId="recurso-entregado-label" label="Entregas" value={entregado}
                onChange={(evento) => setEntregado(evento.target.value as Recurso)}>
                {RECURSOS.map((recurso) => (
                  <MenuItem key={recurso} value={recurso}>
                    {recurso} (tienes {recursosJugador[recurso]})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={enviando}>
              <InputLabel id="recurso-recibido-label">Recibes</InputLabel>
              <Select labelId="recurso-recibido-label" label="Recibes" value={recibido}
                onChange={(evento) => setRecibido(evento.target.value as Recurso)}>
                {RECURSOS.map((recurso) => (
                  <MenuItem key={recurso} value={recurso}>
                    {recurso} (banca: {recursosBanca[recurso]})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={onCerrar} disabled={enviando}>Cancelar</Button>
          <Button type="button" variant="contained" disabled={!puedeConfirmar}
            onClick={() => {
              if (entregado && recibido && puedeConfirmar) onConfirmar(entregado, recibido);
            }}>
            {enviando ? 'Intercambiando…' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default IntercambioBanca;
