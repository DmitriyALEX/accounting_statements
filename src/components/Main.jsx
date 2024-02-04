import React, {useState, useEffect, useRef} from "react";
import styles from './Main.module.css';
import copy from './icons/image.png';

const Main = () => {

    const stateRef = useRef(null);

    // RENDERED DATA
    const [renderedData, setRenderedData] = useState([]);

    // DATA - statement from input
    const [statement, setStatement] = useState(0);
    const statementInputToNumber = Number(statement);
    
    // GET DATA FIRST RENDER
    useEffect(() => {
        fetch('https://658c65f1859b3491d3f6058a.mockapi.io/energy')
        .then(res => res.json()) 
        .then(data => setRenderedData(data))
    }, []);

    // ADD DATA
    function addItem() {
        const id = renderedData.length + 1;
        const date = new Date().toLocaleDateString('uk-UA');
        const statement = statementInputToNumber;
        const statementDataValue = renderedData.map((value) => value.statement).pop();
        const res = statement - statementDataValue;
        const amount = (res * 2.88).toFixed(2);
      
        fetch('https://658c65f1859b3491d3f6058a.mockapi.io/energy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: id,
            date: date,
            statement: statement,
            amount: amount
          })
        })
        .then(res => res.json())
        .then(data => {
          setRenderedData([...renderedData, data]);
        })
        .catch(error => console.error(error));
        // ADD VALUE TO SPAN
        addValue();
    }

    // DELETE
    function deleteItem(id) {
        const confirmVAlue = window.confirm('точно?')
        if(confirmVAlue) {
            fetch(`https://658c65f1859b3491d3f6058a.mockapi.io/energy/${id}`, {
                method: 'DELETE',
            })
            .then(() => {
                const updatedData = renderedData.filter(item => item.id !== id);
                setRenderedData(updatedData);
            })
        }   
    }

    // ADD VALUE TO SPAN
    function addValue() {
        stateRef.current.innerHTML =`${statement}`
    }

    // CLIPBOARD
    function copyBankNumber() {
        const text = document.getElementById('bankNumber').innerText;
        navigator.clipboard.writeText(text);
    }

    function copyIpn() {
        const text = document.getElementById('ipn').innerText;
        navigator.clipboard.writeText(text);
    }

    function copyRecipient() {
        const text = document.getElementById('recipient').innerText;
        navigator.clipboard.writeText(text);
    }

    function copyPurpose() {
        const text = document.getElementById('purpose').innerText;
        navigator.clipboard.writeText(text);
    }

    return (
        <main className={styles.container}>
            <section className={styles.gaz_container}>
                <p className={styles.title_main}>Розподіл газу</p>
                <nav>   
                    <a href="https://my.grmu.com.ua/login">Перейти</a>
                </nav>
            </section>
            <section className={styles.electro_container}>
                <p className={styles.title_main}>Електроенергія</p>
                <div className={styles.electro_container_input}>
                    <input 
                        type="number"
                        onChange={(e) => setStatement(e.target.value)}
                    />
                    <button 
                        onClick={addItem}
                        className={styles.ok_btn}
                    >ok</button>
                </div>
                <table className={styles.table_container}>
                    <thead className={styles.table_container_thead}>
                        <tr className={styles.table_container_thead_tr}>
                            <th>/</th>
                            <th>Дата</th>
                            <th>Дані</th>
                            <th>Сума</th>
                            <th>del</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderedData.map((item, idx) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{item.date}</td>
                                <td>{item.statement}</td>
                                <td>{item.amount}</td>
                                <td>
                                    <button
                                    onClick={() => deleteItem(item.id)}
                                    >del</button>
                                </td>
                            </tr>
                        ))}            
                    </tbody>
                </table>
                <article className={styles.electro_container_info}>
                    <p className={styles.title}>Розрахунковий рахунок</p>
                    <p id="bankNumber" className={styles.bankNumber}>
                        UA29XXXXXXXXXXXXX
                        <img
                            onClick={copyBankNumber} 
                            src={copy}
                            alt={copy}
                        />
                    </p>
                    <p className={styles.title}>ІПН/ЄДРПОУ</p>
                    <p id="ipn">
                        2XXXXXX
                        <img
                            onClick={copyIpn} 
                            src={copy}
                            alt={copy}
                        />
                        </p>
                        <span className={styles.title}>Одержувач</span>
                    <p id="recipient"> Садівницьке товариство "__"
                        <img
                            onClick={copyRecipient} 
                            src={copy}
                            alt={copy}
                        />
                    </p>
                    <span className={styles.title}>Призначення</span>
                    <p id="purpose">Використання електроенергії, діл.1___,  загальна <span ref={stateRef}></span>
                        <img 
                            onClick={copyPurpose} 
                            src={copy}
                            alt={copy}
                        />
                    </p>
                </article>
            </section>
        </main>
    )
}

export default Main;