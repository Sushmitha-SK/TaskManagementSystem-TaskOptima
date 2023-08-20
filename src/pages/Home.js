import React from 'react'
import '../styles/Home.css'
import showCaseImage from '../assets/showcase-img.png'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()
    return (
        <>
            <div className="showcase">
                <div className="container">
                    <div className="showcase-top">
                        <a className="navbar-brand" onClick={() => navigate('/')}>
                            TaskOptima
                        </a>
                        <button type="button" onClick={() => navigate('/login')}>Login</button>
                    </div>
                    <div className="showcase-content">
                        <div className="sc-left">
                            <h1>Let's make task completion easy</h1>
                            <p>Stay organized, boost productivity, and conquer your goals with our intuitive task management system. Simplify your work, collaborate seamlessly, and never miss a deadline again. Take control of your tasks and achieve success with ease.</p>
                            <div className="sc-btns">
                                <button type="button" onClick={() => navigate('/login')}>
                                    Get Started
                                </button>
                            </div>
                        </div>
                        <div className="sc-right">
                            <img src={showCaseImage} alt="showcase image" />
                        </div>
                    </div>
                </div>

            </div>


        </>
    )
}

export default Home