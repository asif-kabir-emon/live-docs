import Image from "next/image";

const Loader = () => {
    return (
        <div className="loader">
            <Image
                src="/assets/icons/loader.svg"
                alt="Loading..."
                height={32}
                width={32}
                className="animate-spin"
            />
            Loading...
        </div>
    );
};

export default Loader;
