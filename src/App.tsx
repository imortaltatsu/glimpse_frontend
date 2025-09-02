
import { RetroHeader } from './components/ardacity/ar-retro-header';


function App() {
  return (
    <div className="relative min-h-screen">
      <RetroHeader
      title="GLIMPSE"
      subtitle="SEARCH ALMOST"
      highlightedWord="ANYTHING"
      bottomText="WITH VECTOR SEARCHING ACCURACY"
      showCharacters={true}
      character1Image="https://abcdefghijklmnopqrstuvwxyz.arweave.net/"
      character2Image="https://zh5mns2xs4orzalnne62iz47xz7ag54ujodwlfmdbrzk5xymqkeq.arweave.net/yfrGy1eXHRyBbWk9pGefvn4Dd5RLh2WVgwxyrt8Mgok"
      speechBubbleText="Wow look great! What's Glimpse"
      infoBoxText="Glimpse is the one stop solution to search anything on the hyperbeam on the go using vector search feature."
      onSearch={(query, filter) => console.log(query, filter)}
      // onNavToggle={(option) => console.log(option)}
    />
    
     
    
    </div>
  );
}

export default App;
