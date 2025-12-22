import EGflag from '../../assets/Eg-flag.png';

export default function Header() {
    return (
        <>
            <header>
                <div className="flex justify-between items-center p-4 bg-[#202C54] text-[#ffffff] px-20" > 
                    
                    <div>
                        <a>الدعم و المساعدة</a>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                        <img src={EGflag} alt="العربية" width={25} height={25} />
                        <span>العربية</span>
                    </div>
                    
                </div>
            </header>
        </>
    )
}