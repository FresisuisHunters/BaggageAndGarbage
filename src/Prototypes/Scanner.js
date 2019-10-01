Scanner.prototype=
{
    Scanner:function(id)
    {
        this.id = id;
        //sprite
    },
    EnterBag:function(Bag)
    {
        if(this.currentBag == null)
        {
            this.currentBag=Bag;
            this.entryTime = game.time.time;
            return true;
        }
        else
        {
            return false;
        }
    },
    ExitBag()
    {

        let exitBag = this.currentBag;
        this.currentBag = null;
        this.entryTime = null;
        return exitBag;
    },
    DisplayScanner()
    {
        
    }

}