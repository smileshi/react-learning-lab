import { useState } from 'react'
import IntroDemo from './lessons/day01/step01-intro/IntroDemo'
import JsxDemo from './lessons/day01/step02-jsx/JsxDemo'
import UserPage from './lessons/day01/step03-components-props/UserPage'
import UserStateDemo from './lessons/day01/step04-usestate/UserStateDemo'
import UserEffectDemo from './lessons/day01/step05-useeffect/UserEffectDemo'
import UserSearch from './lessons/day01/step06-useref/UserSearch'
import './App.css'

const lessons = [
  { title: '组件入门', component: IntroDemo },
  { title: 'JSX 与列表渲染', component: JsxDemo },
  { title: '组件与 Props', component: UserPage },
  { title: 'useState 状态管理', component: UserStateDemo },
  { title: 'useEffect 副作用', component: UserEffectDemo },
  { title: 'useRef 与 DOM', component: UserSearch },
]

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedLesson = lessons[selectedIndex]
  const SelectedDemo = selectedLesson.component

  return (
    <div className="learning-lab">
      <aside className="sidebar">
        <h1>React 学习实验室</h1>
        <p>Day 1 · React 基础</p>
        <nav aria-label="Day 1 课程">
          {lessons.map((lesson, index) => (
            <button
              key={lesson.title}
              type="button"
              className={selectedIndex === index ? 'lesson-link active' : 'lesson-link'}
              aria-current={selectedIndex === index ? 'page' : undefined}
              onClick={() => setSelectedIndex(index)}
            >
              <span>Day 1 · Step {index + 1}</span>
              <strong>{lesson.title}</strong>
            </button>
          ))}
        </nav>
      </aside>
      <main className="lesson-main">
        <header className="lesson-header">
          <p>Day 1 · Step {selectedIndex + 1}</p>
          <h2>{selectedLesson.title}</h2>
          <p>动手操作下方示例，观察页面变化。切换课程后，示例状态会重置。</p>
        </header>
        <section className="demo-panel" aria-label={selectedLesson.title}>
          <SelectedDemo key={selectedIndex} />
        </section>
      </main>
    </div>
  )
}

export default App
