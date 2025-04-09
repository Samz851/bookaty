<?php

namespace App\Http\Controllers\Tenant;

use App\Models\Tenant\Tag;
use App\Services\TagService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class TagController extends Controller
{
    public function index(Request $request): Response
    {
        return response(Tag::all());
    }

    public function store(Request $request): Response
    {
        $tag = Tag::create($request->all());
        return response($tag);
    }

    public function show(Tag $tag): Response
    {
        $tag = Tag::where('id', $tag->id)
                ->first();
        Log::info([$tag->taggable], [__LINE__, __FILE__]);
        return response($tag);
    }

    public function getTagMembers(Request $request): Response
    {
        $service = new TagService();
        $tagMembers = $service->getTagMembers($request->id);
        $tagMembersClean = $service->getTagMembersClean($request->id);

        return response([
            'tagMembers' => $tagMembers,
            'tagMembersClean' => $tagMembersClean
        ]);
    }

    public function getTagBalance(Request $request): Response
    {
        $service = new TagService();
        $tagBalance = $service->getTagMembersBalance($request->id);

        return response([
            'tagBalance' => $tagBalance
        ]);
    }

    public function getTagLeafMembers(Request $request): Response
    {
        $service = new TagService();
        $tagLeafMembers = $service->getTagLeafMembers($request->id);

        return response([
            'tagLeafMembers' => $tagLeafMembers,
            'ids' => $tagLeafMembers->pluck('id')->toArray()
        ]);
    }

    public function getTagBalanceByRanges(Request $request): Response
    {
        $service = new TagService();
        $tagBalanceByRanges = $service->getTagMembersBalanceByRange($request->id, $request->from, $request->to);

        return response([
            'tagBalanceByRanges' => $tagBalanceByRanges
        ]);
    }
}
