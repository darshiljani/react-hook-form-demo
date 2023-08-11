import { useForm, useFieldArray } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";

type FormValues = {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phonenumbers: string[];
  phNumbers: { number: string }[];
  age: number;
  dob: Date;
};

function YoutubeForm() {
  let renderCount = 0;
  // const form = useForm();
  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    getValues,
    setValue,
    reset,
  } = useForm<FormValues>({
    defaultValues: async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
      const data = await res.json();
      return {
        username: data.username,
        email: data.email,
        channel: "",
        social: {
          twitter: "",
          facebook: "",
        },
        phonenumbers: ["", ""],
        phNumbers: [{ number: "" }],
        age: 0,
        dob: new Date(),
      };
    },
  });

  const {
    errors,
    touchedFields,
    dirtyFields,
    isDirty,
    isValid,
    isSubmitting,
    isSubmitted,
    isSubmitSuccessful,
    submitCount,
  } = formState;

  // console.log(touchedFields, dirtyFields);

  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control: control,
  });

  renderCount++;

  async function onSubmit(data: FormValues) {
    console.info("Submitted data : ", data);
  }

  async function onError(errors: FieldErrors) {
    console.warn(errors);
  }

  const watchSingleField = watch("username");
  const watchMultipleFields = watch(["username", "email"]);
  const watchForm = watch();

  useEffect(() => {
    const subscription = watch((value) => {
      console.log(value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleGetValues = () => {
    console.log("get values ==>", getValues(["username", "social.facebook"]));
  };

  const handleSetValue = () => {
    setValue("username", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <div className="container">
      <h2>Watching single value : {watchSingleField}</h2>
      {/* <h2>Watching multiple values : {watchMultipleFields}</h2>
      <h2>Watching whole form : {JSON.stringify(watchForm)}</h2> */}
      <form
        className="flex flex-col justify-start gap-4"
        onSubmit={handleSubmit(onSubmit, onError)}
        noValidate
      >
        <h3 className="text-start">Youtube form (Renders : {renderCount})</h3>

        {/* {isSubmitSuccessful && (
          <div className="bg-green-600 text-white p-2">
            Submitted successfully!
          </div>
        )} */}

        <div className="flex items-center gap-4">
          <label htmlFor="username" className="w-40">
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
          <label htmlFor="email" className="w-40">
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
          <label htmlFor="channel" className="w-40">
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

        <div className="flex items-center gap-4">
          <label htmlFor="twitter" className="w-40">
            Twitter
          </label>
          <input
            type="text"
            id="twitter"
            {...register("social.twitter", {
              required: "Twitter username is required!",
            })}
          ></input>
          <span className="error">{errors.social?.twitter?.message}</span>
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="facebook" className="w-40">
            Facebook
          </label>
          <input
            type="text"
            id="facebook"
            {...register("social.facebook", {
              required: "Facebook username is required!",
            })}
          ></input>
          <span className="error">{errors.social?.facebook?.message}</span>
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="primary-phone" className="w-40">
            Primary Phone number
          </label>
          <input
            type="text"
            id="primary-phone"
            {...register("phonenumbers.0", {
              required: "Primary phone number is required!",
            })}
          ></input>
          <span className="error">{errors?.phonenumbers?.[0]?.message}</span>
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="secondary-phone" className="w-40">
            Secondary Phone number
          </label>
          <input
            type="text"
            id="secondary-phone"
            {...register("phonenumbers.1", {
              disabled: watch("phonenumbers.0") === "",
              required: "Secondary phone number is required!",
            })}
          ></input>
          <span className="error">{errors?.phonenumbers?.[1]?.message}</span>
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="age" className="w-40">
            Age
          </label>
          <input
            type="number"
            id="age"
            {...register("age", {
              valueAsNumber: true,
              required: "Age is required!",
            })}
          ></input>
          <span className="error">{errors.age?.message}</span>
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="dob" className="w-40">
            Date of birth
          </label>
          <input
            type="date"
            id="dob"
            {...register("dob", {
              valueAsDate: true,
              required: "Date of birth is required!",
            })}
          ></input>
          <span className="error">{errors.dob?.message}</span>
        </div>

        <div className="flex flex-col mt-10">
          <label className="text-start">Phone number array field</label>
          <div className="flex flex-col gap-2">
            {fields.map((field, index) => {
              return (
                <div key={field.id} className="flex items-center gap-4">
                  <input
                    type="text"
                    {...register(`phNumbers.${index}.number` as const, {
                      required: "This field cannot be blank!",
                    })}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      className="bg-red-500 text-white"
                      onClick={() => remove(index)}
                    >
                      Remove number
                    </button>
                  )}
                  <p className="error">{errors?.phNumbers?.[index]?.message}</p>
                </div>
              );
            })}
          </div>
          <div className="flex items-center mt-4">
            <button
              type="button"
              className="border-2 text-white"
              onClick={() => append({ number: "" })}
            >
              Add number
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-600 text-black w-1/4 disabled:cursor-not-allowed disabled:bg-stone-600"
            // disabled={!isDirty || !isValid}
            disabled={!isDirty || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          <button
            className="bg-red-600 text-black w-1/4"
            onClick={() => reset()}
          >
            Reset
          </button>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            className="bg-white text-black w-1/4"
            onClick={handleGetValues}
          >
            Get values
          </button>
          <button
            type="button"
            className="bg-white text-black w-1/4"
            onClick={handleSetValue}
          >
            Set value
          </button>
        </div>
      </form>

      <DevTool control={control} />
    </div>
  );
}

export default YoutubeForm;
