"use client";

export function UpiUserSearch({ input, setInput, handleSubmit, placeholder, loading = false }) {
  const handleInput = (e) => {
    setInput(() => e.target.value);
  };

  return (
    <form className=" max-w-screen-sm mx-auto my-6">
      <div className="mt-1 w-full rounded-full py-2 pl-4 pr-2 flex shadow-inner-sm bg-white">
        <input
          id="phone"
          name="phone"
          placeholder={placeholder}
          required
          onChange={handleInput}
          type="text"
          value={input}
          className="border-none placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-0"
        />
        <button
          disabled={loading}
          className=" ml-auto text-sm text-white bg-primary px-4 rounded-full"
          onClick={handleSubmit}
        >
          {loading ? "Loading" : "Submit"}
        </button>
      </div>
    </form>
  );
}
