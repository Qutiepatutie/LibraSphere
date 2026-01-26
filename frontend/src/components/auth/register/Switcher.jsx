import styles from "../../../styles/components/switcher.module.css"

export default function Switcher({option="", setOption="", options, width="", height="", outline="", borderRadius="" }) {
    return (
        <div className={styles.container} style={{ width:width, height:height, outline: outline, borderRadius: borderRadius}}>
            {options.map((opt, index)=> {

                const value = opt.toLowerCase();

                return (
                    <div
                        key={opt}
                        className={styles.option}
                        onClick={() => setOption(value)}
                        style={{ color: option === value ? "white" : ""}}
                    >
                        {opt}
                    </div>
                )
            })}

            <div
                className={styles.slider} 
                style={{ 
                    transform: `translateX(${options.findIndex(opt => opt.toLowerCase() === option) * 100}%)`
                }}
            />
        </div>
    )
}