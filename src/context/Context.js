import { createContext, useState } from "react";
import run from '../config/Gemini'; // Import your chat function here

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState('');
    const [recentPrompt, setRecentPrompt] = useState('');
    const [prevPrompt, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState('');

    const delayPara = (index, nextWord) => {
        setTimeout(function(){
            setResultData(prev => prev + nextWord);
        }, 75 * index);
    }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    }

    const onSent = async (prompt) => {
        setResultData('');
        setLoading(true);
        setShowResult(true);
        let response = '';

        try {
            if (prompt) {
                console.log(prompt)
                response = await run(prompt);
                setRecentPrompt(prompt);

                // Check if the prompt already exists in prevPrompt before adding it
                if (!prevPrompt.includes(prompt)) {
                    setPrevPrompts(prev => [...prev, prompt]);
                }
            } else {
                setRecentPrompt(input);
            }

            // Ensure response is a string before proceeding
            if (typeof response === 'string') {
                let responseArray = response.split('**');
                let newResponse = '';

                for (let i = 0; i < responseArray.length; i++) {
                    if (i === 0 || i % 2 !== 1) {
                        newResponse += responseArray[i];
                    } else {
                        newResponse += '<b>' + responseArray[i] + '</b>';
                    }
                }

                let newResponse2 = newResponse.split('*').join('</br>');
                let newResponseArray = newResponse2.split(' ');

                for (let i = 0; i < newResponseArray.length; i++) {
                    const nextWord = newResponseArray[i];
                    delayPara(i, nextWord + ' ');
                }
            } else {
                console.error("Response is not a string:", response);
            }
        } catch (error) {
            console.error("Error processing the response:", error);
        } finally {
            setLoading(false);
            setInput('');
        }
    }

    const contextValue = {
        prevPrompt,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        showResult,
        recentPrompt,
        input,
        setInput,
        loading,
        resultData,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;
