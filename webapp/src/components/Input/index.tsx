export const Input: React.FC<{
  label: string
  name: string
  state: Record<string, any>
  setState: React.Dispatch<React.SetStateAction<any>>
}> = ({ label, name, state, setState }) => {
  return (
    <div style={{ marginBottom: 10 }}>
      <label htmlFor={name}>{label}</label>
      <br />
      <input
        type="text"
        onChange={(e) => setState(() => ({ ...state, [name]: e.target.value }))}
        value={state[name]}
        name={name}
        id={name}
      />
    </div>
  )
}
