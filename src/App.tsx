import { Stage } from './components/Stage';
import { useMuseumStore } from './store/useMuseumStore';
import { IntroScene } from './scenes/IntroScene';
import { HallScene } from './scenes/HallScene';
import { ChoiceScene } from './scenes/ChoiceScene';
import { CompanionScene } from './scenes/CompanionScene';
import { ResultScene } from './scenes/ResultScene';

export default function App() {
  const scene = useMuseumStore((state) => state.scene);

  return (
    <Stage>
      {scene === 'intro' && <IntroScene />}
      {scene === 'hall' && <HallScene />}
      {scene === 'choice' && <ChoiceScene />}
      {scene === 'companion' && <CompanionScene />}
      {scene === 'result' && <ResultScene />}
    </Stage>
  );
}
