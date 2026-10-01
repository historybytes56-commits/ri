import Message from '../components/Message.jsx'
import { SENTENCES } from '../data/message.js'

function Home() {
  return (
    <div className="landscape-stage">
      <main>
        <Message sentences={SENTENCES} />
      </main>
    </div>
  )
}

export default Home
