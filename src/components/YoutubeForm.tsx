import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

type FormValues = {
  username: string;
  email: string;
  channel: string;
};

function YoutubeForm() {
  let renderCount = 0;
  // const form = useForm();
  const { register, control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
      const data = await res.json();
      return {
        username: data.username,
        email: data.email,
        channel: "",
      };
    },
  });
  const { errors } = formState;

  renderCount++;

  async function onSubmit(data: FormValues) {
    console.info("Submitted data : ", data);
  }

  return (
    <div className="container">
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <h3 className="text-start">Youtube form (Renders : {renderCount})</h3>
        <div className="flex items-center gap-4">
          <label htmlFor="username" className="w-20">
            Username
          </label>
          <input
            type="text"
            id="username"
            {...register("username", {
              required: { value: true, message: "Username is required!" },
            })}
          ></input>
          <span className="error">{errors.username?.message}</span>
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="email" className="w-20">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9-]+)$/,
                message: "Invalid email format!",
              },
              validate: {
                notAdmin: (fieldValue) => {
                  return (
                    fieldValue !== "admin@demo.com" ||
                    "Enter a different email address"
                  );
                },
                notBlackListed: (fieldValue) => {
                  return (
                    !fieldValue.endsWith("baddomain.com") ||
                    "This domain is not supported!"
                  );
                },
              },
            })}
          ></input>
          <span className="error">{errors.email?.message}</span>
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="channel" className="w-20">
            Channel
          </label>
          <input
            type="text"
            id="channel"
            {...register("channel", {
              required: "Channel name is required!",
            })}
          ></input>
          <span className="error">{errors.channel?.message}</span>
        </div>
        <button type="submit" className="bg-white text-black w-1/4">
          Submit
        </button>
      </form>

      <DevTool control={control} />
    </div>
  );
}

export default YoutubeForm;
