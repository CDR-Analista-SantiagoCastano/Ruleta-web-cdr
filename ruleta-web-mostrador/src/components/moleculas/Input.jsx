import { useFormContext } from "react-hook-form"
import { AnimatePresence, motion } from "framer-motion";
import { MdError } from "react-icons/md";

export const Input = ({ label, type, id, placeholder, validation, name }) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const rules = type === "number"
        ? { valueAsNumber: true, ...validation }
        : validation;

    const inputError = findInputError(errors, name)
    const isInvalid = isFormInvalid(inputError)

    return (
        <div
            style={{
                display: "flex",        // flex
                flexDirection: "column",// flex-col
                width: "100%",          // w-full
                gap: "0.5rem"           // gap-2 → 0.5rem (8px)
            }}
        >
            <div
                style={{
                    display: "flex",              // flex
                    alignItems: "end",
                    justifyContent: "space-between" // justify-between
                }}
            >
                <label
                    htmlFor={id}
                    style={{
                        fontWeight: 600,             // font-semibold
                        textTransform: "capitalize",  // capitalize
                        display: "flex",
                        alignItems: "end"
                    }}
                    onWheel={(e) => e.target.blur()}
                >
                    {label}
                </label>
                <AnimatePresence mode="wait" initial={false}>
                    {isInvalid && (
                        <InputError
                            message={inputError.error.message}
                            key={inputError.error.message}
                        />
                    )}
                </AnimatePresence>
            </div>
            <input
                id={id}
                type={type}
                style={{
                    maxWidth: "100%",          // w-full
                    padding: "1.25rem",     // p-5
                    fontWeight: 500,        // font-medium
                    borderWidth: "1px",     // border
                    borderStyle: "solid",
                    borderColor: "#cbd5e1", // border-slate-300 (Tailwind -> hex #cbd5e1)
                    borderRadius: "0.375rem", // rounded-md (6px)
                    "::placeholder": {
                        opacity: 0.6          // placeholder:opacity-60
                    }
                }}
                placeholder={placeholder}
                {...register(name, rules)}
            />
        </div>
    )
}

const isFormInvalid = err => {
    if (Object.keys(err).length > 0) return true
    return false
}

function findInputError(errors, name) {
    const filtered = Object.keys(errors)
        .filter(key => key.includes(name))
        .reduce((cur, key) => {
            return Object.assign(cur, { error: errors[key] })
        }, {})

    return filtered

}

const InputError = ({ message }) => {
    return (
        <motion.p
            style={{
                display: "flex",          // flex
                alignItems: "center",     // items-center
                columnGap: "0.25rem",     // gap-1 (4px = 0.25rem)
                paddingLeft: "0.5rem",    // px-2 (0.5rem = 8px)
                paddingRight: "0.5rem",
                fontWeight: 600,          // font-semibold
                color: "#ef4444",         // text-red-500
                backgroundColor: "#fee2e2", // bg-red-100
                borderRadius: "0.375rem"  // rounded-md (6px)
            }}
            {...framer_error}
        >
            <MdError />
            {message}
        </motion.p>
    )
}

const framer_error = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.2 },
}