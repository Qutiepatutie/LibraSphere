export default function ErrorMessage({ message }) {

    return (
        <p style={{
            position: "relative",
            color: "#cc0000",
            height: "1em",
            marginRight: "auto",
            fontSize: "0.8em",
        }}>
            <i>{message}</i>
        </p>
    );
}